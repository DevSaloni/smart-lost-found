import { createReport, getUserReports, getReportById, getAllReportsForBrowse, updateReport } from "../models/reportModel.js";
import { findMatchesForReport } from "../services/matchService.js";

export const createReportController = async (req, res) => {
    try {
        const {
            type,
            item_name,
            category,
            location,
            date,
            description,
            identifiers,
            status,
            alert_method,
            lat,
            lng
        } = req.body;

        const trimmedItemName = item_name ? item_name.trim() : "";
        const trimmedLocation = location ? location.trim() : "";

        const image = req.file ? req.file.filename : null;

        const report = await createReport({
            user_id: req.user.id, // from auth middleware
            type,
            item_name: trimmedItemName,
            category,
            location: trimmedLocation,
            date,
            description,
            identifiers,
            image_url: image,
            alert_method,
            lat,
            lng
        });

        // Trigger Matchmaking in the background to keep response time fast
        findMatchesForReport(report).catch(err => console.error("Background Matchmaking Error:", err));

        res.status(201).json({
            success: true,
            message: "Report created successfully. AI is scanning for matches in the background.",
            report
        });

    } catch (error) {
        console.error("DEBUG - Report Submission Error:", {
            userId: req.user?.id,
            error: error.message
        });

        if (error.code === '23503') { // Foreign key violation
            return res.status(403).json({ error: "Unauthorized user ID. Please refresh and log in again." });
        }

        res.status(500).json({ error: error.message || "Server error" });
    }
}

export const getAllReportsController = async (req, res) => {
    try {
        const { type, category, status, search, sort, dateRange } = req.query;
        const reports = await getAllReportsForBrowse({ type, category, status, search, sort, dateRange });
        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error("Error fetching reports for browse:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getUserReportsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const reports = await getUserReports(userId);
        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error("Error fetching user reports:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getReportByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await getReportById(id);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.status(200).json({ success: true, report });
    } catch (error) {
        console.error("Error fetching report details:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateReportController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            type,
            item_name,
            category,
            location,
            date,
            description,
            identifiers,
            alert_method,
            lat,
            lng
        } = req.body;

        const trimmedItemName = item_name ? item_name.trim() : "";
        const trimmedLocation = location ? location.trim() : "";

        const image = req.file ? req.file.filename : null;

        const reportData = {
            type,
            item_name: trimmedItemName,
            category,
            location: trimmedLocation,
            date,
            description,
            identifiers,
            alert_method,
            image_url: image,
            lat,
            lng
        };

        const updatedReport = await updateReport(id, req.user.id, reportData);

        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found or you are not authorized to edit it" });
        }

        // Trigger Matchmaking in the background on Update
        findMatchesForReport(updatedReport).catch(err => console.error("Background Matchmaking Error (Update):", err));

        res.status(200).json({
            success: true,
            message: "Report updated successfully. AI is re-scanning for matches.",
            report: updatedReport
        });

    } catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
};