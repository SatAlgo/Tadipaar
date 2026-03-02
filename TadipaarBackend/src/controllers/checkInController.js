const pool = require('../config/db');
const path = require('path');

exports.handleCheckIn = async (req, res) => {
    try {
        const { aadhaar_number, latitude, longitude } = req.body;
        
        // 1. Validate if photo exists (Uploaded via Multer)
        if (!req.file) {
            return res.status(400).json({ error: "Photo is required for verification" });
        }

        const imagePath = req.file.path;

        // 2. Logic to check if they are inside Pune/Pimpri (Placeholder for Geofencing)
        // In a real scenario, you'd compare lat/lng against your demarcation coordinates
        const isWithinBoundary = true; 

        // START TRANSACTION
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 3. Insert into check_ins table
            await client.query(
                `INSERT INTO check_ins (aadhaar_number, latitude, longitude, image_path, is_within_boundary) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [aadhaar_number, latitude, longitude, imagePath, isWithinBoundary]
            );

            // 4. UPDATE the individual's last seen status (The code you asked for)
            await client.query(
                `UPDATE externed_individuals 
                 SET last_photo_uploaded_at = NOW() 
                 WHERE aadhaar_number = $1`,
                [aadhaar_number]
            );

            await client.query('COMMIT');
            
            res.status(200).json({ 
                success: true, 
                message: "Verification successful. Last check-in updated.",
                compliant: isWithinBoundary 
            });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (err) {
        console.error("Check-in Error:", err.message);
        res.status(500).json({ error: "Internal Server Error during check-in" });
    }
};