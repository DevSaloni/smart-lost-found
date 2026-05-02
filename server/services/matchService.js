import pool from "../config/db.js";
import { createMatch } from "../models/matchModel.js";
import { createNotification } from "../models/notificationModel.js";
import { sendExternalNotification } from "./notificationService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getIO } from "../config/socket.js";
import fs from "fs";
import path from "path";
import axios from "axios";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper to convert file (local or URL) to Gemini part object
 */
const fileToGenerativePart = async (filePath, mimeType) => {
    try {
        if (!filePath) return null;

        let data;
        if (filePath.startsWith('http')) {
            // Handle Cloudinary/Web URL
            const response = await axios.get(filePath, { responseType: 'arraybuffer' });
            data = Buffer.from(response.data).toString("base64");
        } else {
            // Handle Local File (backward compatibility)
            const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), "uploads", filePath);
            if (!fs.existsSync(absolutePath)) return null;
            data = Buffer.from(fs.readFileSync(absolutePath)).toString("base64");
        }

        return {
            inlineData: {
                data,
                mimeType
            },
        };
    } catch (err) {
        console.error("Error processing image for Gemini:", err.message);
        return null;
    }
};

/**
 * String similarity using word intersection (Case-insensitive)
 */
const calculateStringSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    const s1_raw = str1.trim().toLowerCase();
    const s2_raw = str2.trim().toLowerCase();

    // Exact match boost
    if (s1_raw === s2_raw) return 100;

    const s1 = s1_raw.split(/\s+/).filter(w => w.length > 2);
    const s2 = s2_raw.split(/\s+/).filter(w => w.length > 2);
    if (s1.length === 0 || s2.length === 0) return 0;

    const intersection = s1.filter(word => s2.includes(word));
    return (intersection.length * 2) / (s1.length + s2.length) * 100;
};

/**
 * Comprehensive text-based similarity scoring for reports
 */
const calculateSimilarity = (item1, item2) => {
    if (!item1 || !item2) return 0;

    const nameScore = calculateStringSimilarity(item1.item_name, item2.item_name);
    const descScore = calculateStringSimilarity(item1.description, item2.description);
    const idScore = calculateStringSimilarity(item1.identifiers || "", item2.identifiers || "");

    // Weighted average: Name (40%), Description (40%), Identifiers (20%)
    let totalTextScore = (nameScore * 0.4) + (descScore * 0.4) + (idScore * 0.2);

    // Bonus for high name match
    if (nameScore > 80) totalTextScore += 10;

    return Math.min(totalTextScore, 100);
};

/**
 * AI-powered Multimodal similarity scoring using Google Gemini (Text + Image)
 */
const calculateAISimilarity = async (item1, item2) => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            console.warn("GEMINI_API_KEY is missing or default. Falling back to text-only matching.");
            return null;
        }

        const prompt = `
            You are a professional Lost and Found matching system. 
            Compare these two reports and determine if they describe the EXACT SAME item.
            
            Report 1 (${item1.type.toUpperCase()}):
            - Item Name: ${item1.item_name}
            - Category: ${item1.category}
            - Description: ${item1.description}
            - Identifiers: ${item1.identifiers || "None"}
            
            Report 2 (${item2.type.toUpperCase()}):
            - Item Name: ${item2.item_name}
            - Category: ${item2.category}
            - Description: ${item2.description}
            - Identifiers: ${item2.identifiers || "None"}
            
            SCORING RULES:
            1. 90-100: Definite match. Everything (brand, model, color, unique marks) aligns perfectly.
            2. 70-89: Highly likely match. Minor differences in description but core item is clearly the same.
            3. 40-69: Possible match. Similar item but lacking unique proof.
            4. 0-39: Unlikely match or different items.
            
            VISUAL ANALYSIS (If images provided):
            - Compare brand logos, specific wear/scratches, shapes, and exact color shades.
            - If images CLEARLY show different brands or distinct shapes, the score MUST be below 20.
            - Lighting differences are common; be flexible with "dark blue" vs "black" unless the image proves otherwise.
            
            Return ONLY a JSON object:
            {
                "score": number (0-100),
                "reason": "short explanation (max 15 words)"
            }
        `;

        const visualParts = [];

        // Add images if they exist
        if (item1.image_url) {
            const part = await fileToGenerativePart(item1.image_url, "image/jpeg");
            if (part) visualParts.push(part);
        }
        if (item2.image_url) {
            const part = await fileToGenerativePart(item2.image_url, "image/jpeg");
            if (part) visualParts.push(part);
        }

        let result = null;
        let lastError = null;
        const modelNames = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro"];

        for (const name of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: name });
                console.log(`DEBUG - AI: Attempting with model "${name}"`);
                result = await model.generateContent([prompt, ...visualParts]);
                if (result) break;
            } catch (err) {
                lastError = err;
                console.warn(`DEBUG - AI: Model "${name}" failed.`);
            }
        }

        if (!result) {
            throw lastError || new Error("All Gemini models failed.");
        }

        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (err) {
        if (err.message?.includes('404')) {
            console.error(`Gemini Model 404 Error: Your API key lacks access to these models. Check Google AI Studio. Error: ${err.message}`);
        } else if (err.message?.includes('API_KEY_INVALID')) {
            console.error("Gemini API Key Error: Your API key is invalid.");
        } else {
            console.error("AI Similarity Error:", err.message);
        }
        return null;
    }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const findMatchesForReport = async (newReport) => {
    try {
        const { id, type, category, item_name, location, user_id, lat, lng, date: reportDate } = newReport;

        const oppositeType = type === 'lost' ? 'found' : 'lost';

        // We removed the strict date condition to catch items that might have been reported with slightly wrong dates.
        // Instead, we'll penalize date mismatches in the scoring logic.
        const query = `
            SELECT r.*, u.email, u.phone, u.name as user_name
            FROM reports r
            JOIN users u ON r.user_id = u.id
            WHERE r.type = $1 
            AND LOWER(r.category) = LOWER($2) 
            AND r.id != $3
            AND r.user_id != $4
            AND r.status = 'active';
        `;

        const { rows: candidates } = await pool.query(query, [oppositeType, category, id, user_id]);

        console.log(`DEBUG - Matchmaking: Found ${candidates.length} potential ${oppositeType} candidates in category "${category}"`);

        const matches = [];

        for (const candidate of candidates) {
            // 1. Geo-Filtering
            let locationScore = 0;
            const distance = calculateDistance(lat, lng, candidate.lat, candidate.lng);

            if (distance !== null) {
                if (distance <= 5) locationScore = 100;
                else if (distance <= 20) locationScore = 80;
                else if (distance <= 50) locationScore = 50;
                else if (distance <= 100) locationScore = 20;
                else continue; // Still skip if too far
            } else {
                locationScore = calculateStringSimilarity(location, candidate.location);
            }

            // 2. Date Scoring (Soft Filter)
            let datePenalty = 0;
            const d1 = new Date(reportDate);
            const d2 = new Date(candidate.date);
            const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

            // Logic: Lost item should be found AFTER it was lost. 
            // If found BEFORE, it's likely not the same item, unless dates are messy.
            if (type === 'lost' && d2 < d1) {
                if (diffDays > 7) datePenalty = 20; // More forgiving date penalty
                else datePenalty = 5;
            } else if (type === 'found' && d2 > d1) {
                if (diffDays > 7) datePenalty = 20;
                else datePenalty = 5;
            }

            // 3. Intelligence Layer (AI Text + Vision)
            let totalSimilarity = 0;
            let matchReason = "Keyword match found";

            const aiResult = await calculateAISimilarity(newReport, candidate);

            if (aiResult && typeof aiResult.score === 'number') {
                // AI Score is primary (85%), Location is secondary (15%)
                totalSimilarity = Math.round((aiResult.score * 0.85) + (locationScore * 0.15));
                matchReason = aiResult.reason || "AI matched visual/text descriptions";
            } else {
                const textSimilarity = calculateSimilarity(newReport, candidate);
                totalSimilarity = Math.round((textSimilarity * 0.7) + (locationScore * 0.3));
                matchReason = "Text-based similarity detected";
            }

            // Apply Date Penalty
            totalSimilarity = Math.max(0, totalSimilarity - datePenalty);

            // 4. Process the Match
            console.log(`DEBUG - Final Score: Item "${candidate.item_name}" -> Score: ${totalSimilarity}% (Penalty: ${datePenalty})`);

            // Threshold: 40% for quality matches
            const threshold = 40;

            if (totalSimilarity >= threshold) {
                console.log(`MATCH FOUND! [${totalSimilarity}%] between Report ${id} and ${candidate.id}`);
                const lost_report_id = type === 'lost' ? id : candidate.id;
                const found_report_id = type === 'found' ? id : candidate.id;

                const match = await createMatch({
                    lost_report_id,
                    found_report_id,
                    similarity_score: totalSimilarity,
                    match_reason: matchReason
                });

                const notificationMessage = `[Match Found] ${totalSimilarity}% - ${matchReason}`;

                // 1. Notify the Candidate (Existing report owner)
                await createNotification({
                    user_id: candidate.user_id,
                    report_id: candidate.id,
                    type: 'match_found',
                    message: notificationMessage
                });

                const io = getIO();
                const roomName = `user_${candidate.user_id}`;
                console.log(`DEBUG - Socket: Emitting match_found to ${roomName}`);

                io.to(roomName).emit("match_found", {
                    message: notificationMessage,
                    report_id: candidate.id,
                    match_id: match.id,
                    similarity: totalSimilarity
                });

                const candidateMethod = candidate.alert_method ? candidate.alert_method.toLowerCase() : 'push';
                if (candidateMethod !== 'push') {
                    await sendExternalNotification(
                        { email: candidate.email, phone: candidate.phone, name: candidate.user_name },
                        notificationMessage,
                        candidate.alert_method
                    );
                }

                // 2. Notify the Creator (New report owner)
                // Fetch creator details first
                const { rows: creatorRows } = await pool.query("SELECT email, phone, name FROM users WHERE id = $1", [user_id]);
                if (creatorRows.length > 0) {
                    const creator = creatorRows[0];
                    const creatorNotificationMessage = `[Match Found] We found a ${totalSimilarity}% match for your new ${type} report!`;

                    await createNotification({
                        user_id: user_id,
                        report_id: id,
                        type: 'match_found',
                        message: creatorNotificationMessage
                    });

                    const io = getIO();
                    const creatorRoom = `user_${user_id}`;
                    console.log(`DEBUG - Socket: Emitting match_found to creator room ${creatorRoom}`);

                    io.to(creatorRoom).emit("match_found", {
                        message: creatorNotificationMessage,
                        report_id: id,
                        match_id: match.id,
                        similarity: totalSimilarity
                    });

                    // We use the same alert method as the report for simplicity, or default to push
                    const creatorMethod = newReport.alert_method ? newReport.alert_method.toLowerCase() : 'push';
                    if (creatorMethod !== 'push') {
                        await sendExternalNotification(
                            creator,
                            creatorNotificationMessage,
                            newReport.alert_method
                        );
                    }
                }

                matches.push(match);
            }
        }

        return matches;
    } catch (error) {
        console.error("Matchmaking error:", error);
        throw error;
    }
};


