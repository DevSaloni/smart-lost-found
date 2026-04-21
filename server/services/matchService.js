import pool from "../config/db.js";
import { createMatch } from "../models/matchModel.js";
import { createNotification } from "../models/notificationModel.js";

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

export const findMatchesForReport = async (newReport) => {
    try {
        const { id, type, category, item_name, location, user_id } = newReport;

        // Find potential candidates of the opposite type and same category
        const oppositeType = type === 'lost' ? 'found' : 'lost';
        
        const query = `
            SELECT * FROM reports 
            WHERE type = $1 
            AND category = $2 
            AND id != $3
            AND status = 'active';
        `;
        
        const { rows: candidates } = await pool.query(query, [oppositeType, category, id]);

        const matches = [];

        for (const candidate of candidates) {
            const nameSimilarity = calculateSimilarity(item_name, candidate.item_name);
            const locationSimilarity = calculateSimilarity(location, candidate.location);
            
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

                // Send notification to the other user
                await createNotification({
                    user_id: candidate.user_id,
                    report_id: candidate.id,
                    type: 'match_found',
                    message: `A potential match for your "${candidate.item_name}" has been found! (${totalSimilarity}% match)`
                });

                matches.push(match);
            }
        }

        return matches;
    } catch (error) {
        console.error("Matchmaking error:", error);
        throw error;
    }
};
