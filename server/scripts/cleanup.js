import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

async function getFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (err) => reject(err));
    });
}

async function cleanup() {
    console.log("Starting cleanup...");

    try {
        // 1. Get all images currently referenced in DB
        const { rows: reports } = await pool.query("SELECT id, image_url FROM reports WHERE image_url IS NOT NULL");
        const { rows: messages } = await pool.query("SELECT id, file_url FROM messages WHERE file_url IS NOT NULL");

        const dbImages = new Set(reports.map(r => r.image_url));
        const dbChatFiles = new Set(messages.map(m => m.file_url));

        // 2. Scan uploads directory
        const files = fs.readdirSync(UPLOADS_DIR).filter(f => fs.statSync(path.join(UPLOADS_DIR, f)).isFile());
        
        const hashMap = new Map(); // hash -> [filenames]
        const orphans = [];

        for (const file of files) {
            const filePath = path.join(UPLOADS_DIR, file);
            const hash = await getFileHash(filePath);

            if (!dbImages.has(file)) {
                orphans.push(file);
            } else {
                if (!hashMap.has(hash)) {
                    hashMap.set(hash, []);
                }
                hashMap.get(hash).push(file);
            }
        }

        console.log(`Found ${orphans.length} orphaned files. Deleting...`);
        for (const file of orphans) {
            fs.unlinkSync(path.join(UPLOADS_DIR, file));
            console.log(`Deleted orphan: ${file}`);
        }

        console.log("Checking for duplicates among referenced files...");
        for (const [hash, filenames] of hashMap.entries()) {
            if (filenames.length > 1) {
                const master = filenames[0];
                const duplicates = filenames.slice(1);

                console.log(`Hash ${hash.substring(0, 8)} has duplicates: ${filenames.join(", ")}`);
                console.log(`Keeping ${master} as canonical.`);

                for (const dupe of duplicates) {
                    // Update DB to point to master
                    await pool.query("UPDATE reports SET image_url = $1 WHERE image_url = $2", [master, dupe]);
                    console.log(`Updated DB: ${dupe} -> ${master}`);

                    // Delete dupe file
                    fs.unlinkSync(path.join(UPLOADS_DIR, dupe));
                    console.log(`Deleted duplicate: ${dupe}`);
                }
            }
        }

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (err) {
        console.error("Cleanup failed:", err);
        process.exit(1);
    }
}

cleanup();
