// controllers/monitoringController.js
const pool = require('../config/db');

exports.getComplianceReport = async (req, res) => {
    try {
        const report = await pool.query(`
            SELECT 
                name, 
                ps_name, 
                section_type, 
                mobile,
                last_photo_uploaded_at,
                CASE 
                    WHEN last_photo_uploaded_at IS NULL THEN 'Never Uploaded'
                    WHEN last_photo_uploaded_at < NOW() - INTERVAL '24 hours' THEN 'Missing'
                    ELSE 'Compliant'
                END as status
            FROM externed_individuals
            WHERE role = 'CRIMINAL'
            ORDER BY last_photo_uploaded_at ASC NULLS FIRST
        `);
        res.json(report.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};