import { createContactMessage } from "../models/contactModel.js";

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, topic, message } = req.body;
        if (!name || !email || !topic || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newContact = await createContactMessage(name, email, topic, message);
        res.status(201).json({ success: true, message: "Message sent successfully!", contact: newContact });
    } catch (err) {
        console.error("Error submitting contact form:", err);
        res.status(500).json({ error: "Failed to send message. Please try again." });
    }
};
