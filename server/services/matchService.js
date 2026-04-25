import pool from "../config/db.js";
import { createMatch } from "../models/matchModel.js";
import { createNotification } from "../models/notificationModel.js";
import { io } from "../index.js";
import { sendExternalNotification } from "./notificationService.js";

/**
 * Simple keyword-based similarity scoring
 */
const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    return (intersection.length * 2) / (words1.length + words2.length) * 100;
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
            const nameSimilarity = calculateSimilarity(item_name, candidate.item_name);
            let locationSimilarity = 0;

            const distance = calculateDistance(lat, lng, candidate.lat, candidate.lng);

            if (distance !== null) {
                if (distance <= 5) {
                    locationSimilarity = 100; // Within 5km is excellent
                } else if (distance <= 20) {
                    locationSimilarity = 80;  // Within 20km is good
                } else if (distance <= 50) {
                    locationSimilarity = 40;  // Within 50km is okay
                } else {
                    locationSimilarity = 0;   // Too far
                    continue; // Geo-filtered out
                }
            } else {
                // Fallback to text similarity if coordinates are missing
                locationSimilarity = calculateSimilarity(location, candidate.location);
            }

            // Average similarity
            const totalSimilarity = Math.round((nameSimilarity * 0.7) + (locationSimilarity * 0.3));

            if (totalSimilarity >= 30) { // Threshold for a "match"
                const lost_report_id = type === 'lost' ? id : candidate.id;
                const found_report_id = type === 'found' ? id : candidate.id;

                const match = await createMatch({
                    lost_report_id,
                    found_report_id,
                    similarity_score: totalSimilarity
                });

                const notificationMessage = `[FindIt] Match Alert: We found a potential match for your "${candidate.item_name}" (${totalSimilarity}% confidence). Check your dashboard for details.`;

                // Send in-app notification
                await createNotification({
                    user_id: candidate.user_id,
                    report_id: candidate.id,
                    type: 'match_found',
                    message: notificationMessage
                });

                // Emit real-time socket event
                io.to(`user_${candidate.user_id}`).emit("match_found", {
                    message: notificationMessage,
                    report_id: candidate.id,
                    match_id: match.id,
                    similarity: totalSimilarity
                });

                // Send External Notification (EMAIL / SMS)
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
