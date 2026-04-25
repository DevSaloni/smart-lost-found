import pool from "../config/db.js";
import { createMatch } from "../models/matchModel.js";
import { createNotification } from "../models/notificationModel.js";
import { io } from "../index.js";
import { sendExternalNotification } from "./notificationService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper to convert local file to Gemini part object
 */
const fileToGenerativePart = (path, mimeType) => {
    if (!fs.existsSync(path)) return null;
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
};

/**
 * Simple keyword-based similarity scoring (Fallback)
 */
const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    return (intersection.length * 2) / (words1.length + words2.length) * 100;
};

/**
 * AI-powered Multimodal similarity scoring using Google Gemini (Text + Image)
 */
const calculateAISimilarity = async (item1, item2) => {
    try {
        if (!process.env.GEMINI_API_KEY) return null;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a highly intelligent Lost and Found matching system with vision capabilities. 
            Compare the following two reports (including images if provided) and determine if they are the same item.
            
            Report 1 (Lost Item):
            - Name: ${item1.item_name}
            - Description: ${item1.description}
            - Identifiers: ${item1.identifiers || "None"}
            
            Report 2 (Found Item):
            - Name: ${item2.item_name}
            - Description: ${item2.description}
            - Identifiers: ${item2.identifiers || "None"}
            
            INSTRUCTIONS:
            1. If images are provided, analyze colors, brands, shapes, and unique damage/stickers.
            2. Be strict: If the descriptions match but the images show different colors or models, give a low score.
            3. Return ONLY a JSON object with:
               "score": (a number between 0 and 100),
               "reason": "a very short explanation (max 15 words)"
        `;

        const visualParts = [];
        
        // Add images if they exist
        if (item1.image_url) {
            const imgPath = path.join(process.cwd(), "uploads", item1.image_url);
            const part = fileToGenerativePart(imgPath, "image/jpeg");
            if (part) visualParts.push(part);
        }
        if (item2.image_url) {
            const imgPath = path.join(process.cwd(), "uploads", item2.image_url);
            const part = fileToGenerativePart(imgPath, "image/jpeg");
            if (part) visualParts.push(part);
        }

        const result = await model.generateContent([prompt, ...visualParts]);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (err) {
        console.error("AI Similarity Error:", err);
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
        const { id, type, category, item_name, location, user_id, lat, lng } = newReport;

        // Find potential candidates of the opposite type and same category
        const oppositeType = type === 'lost' ? 'found' : 'lost';

        const query = `
            SELECT r.*, u.email, u.phone, u.name as user_name
            FROM reports r
            JOIN users u ON r.user_id = u.id
            WHERE r.type = $1 
            AND r.category = $2 
            AND r.id != $3
            AND r.status = 'active';
        `;

        const { rows: candidates } = await pool.query(query, [oppositeType, category, id]);

        const matches = [];

        for (const candidate of candidates) {
            // 1. Geo-Filtering
            let locationScore = 0;
            const distance = calculateDistance(lat, lng, candidate.lat, candidate.lng);

            if (distance !== null) {
                if (distance <= 5) locationScore = 100;
                else if (distance <= 20) locationScore = 80;
                else if (distance <= 50) locationScore = 40;
                else continue; 
            } else {
                locationScore = calculateSimilarity(location, candidate.location);
            }

            // 2. Intelligence Layer (AI Text + Vision)
            let totalSimilarity = 0;
            let matchReason = "Keyword match found";

            const aiResult = await calculateAISimilarity(newReport, candidate);

            if (aiResult && aiResult.score !== undefined) {
                totalSimilarity = Math.round((aiResult.score * 0.8) + (locationScore * 0.2));
                matchReason = aiResult.reason;
            } else {
                const nameSimilarity = calculateSimilarity(item_name, candidate.item_name);
                totalSimilarity = Math.round((nameSimilarity * 0.7) + (locationScore * 0.3));
            }

            // 3. Process the Match
            if (totalSimilarity >= 40) { 
                const lost_report_id = type === 'lost' ? id : candidate.id;
                const found_report_id = type === 'found' ? id : candidate.id;

                const match = await createMatch({
                    lost_report_id,
                    found_report_id,
                    similarity_score: totalSimilarity
                });

                const notificationMessage = `[FindIt AI] ${matchReason} (${totalSimilarity}% Match). Check your dashboard!`;

                await createNotification({
                    user_id: candidate.user_id,
                    report_id: candidate.id,
                    type: 'match_found',
                    message: notificationMessage
                });

                io.to(`user_${candidate.user_id}`).emit("match_found", {
                    message: notificationMessage,
                    report_id: candidate.id,
                    match_id: match.id,
                    similarity: totalSimilarity
                });

                const method = candidate.alert_method ? candidate.alert_method.toLowerCase() : 'push';
                if (method !== 'push') {
                    await sendExternalNotification(
                        { email: candidate.email, phone: candidate.phone, name: candidate.user_name },
                        notificationMessage,
                        candidate.alert_method
                    );
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


