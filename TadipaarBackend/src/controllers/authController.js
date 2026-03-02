const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. UNIFIED LOGIN
exports.login = async (req, res) => {
    try {
        const mobile = req.body.mobile ? req.body.mobile.trim() : null;
        const { password } = req.body;
        if (!mobile || !password) return res.status(400).json({ message: "Mobile and password required" });

        let result = await db.query('SELECT * FROM officers WHERE mobile = $1', [mobile]);
        let user = null;
        let assignedRole = null;

        if (result.rows.length > 0) {
            user = result.rows[0];
            assignedRole = user.role; 
        } else {
            result = await db.query('SELECT * FROM externed_individuals WHERE mobile = $1', [mobile]);
            if (result.rows.length > 0) {
                user = result.rows[0];
                assignedRole = 'CRIMINAL';
            }
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const userId = user.aadhaar_number || user.id;
        const token = jwt.sign({ id: userId, role: assignedRole }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.json({
            token,
            user: { id: userId, aadhaar_number: user.aadhaar_number, name: user.name, role: assignedRole, mobile: user.mobile, ps_name: user.ps_name, section_type: user.section_type }
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 2. REGISTER CRIMINAL
exports.registerCriminal = async (req, res) => {
    const { aadhaar_number, name, alias_name, mobile, password, zone_name, acp_division, ps_name, home_address, residence_during_externment, section_type, start_date, end_date } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO externed_individuals (aadhaar_number, name, alias_name, mobile, password_hash, zone_name, acp_division, ps_name, home_address, residence_during_externment, section_type, externment_start_date, externment_end_date, is_compliant) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true) RETURNING aadhaar_number, name`,
            [aadhaar_number, name, alias_name, mobile.trim(), hashedPassword, zone_name, acp_division, ps_name, home_address, residence_during_externment, section_type, start_date, end_date]
        );
        res.status(201).json({ message: "Criminal registered", criminal: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. HANDLE CHECK-IN
exports.handleCheckIn = async (req, res) => {
    const client = await db.connect();
    try {
        const { latitude, longitude, aadhaar_number } = req.body;
        const imagePath = req.file ? req.file.path : null;
        await client.query('BEGIN');
        await client.query(`INSERT INTO check_ins (aadhaar_number, latitude, longitude, image_path) VALUES ($1, $2, $3, $4)`, [aadhaar_number, latitude, longitude, imagePath]);
        await client.query(`UPDATE externed_individuals SET is_compliant = true, last_photo_uploaded_at = NOW() WHERE aadhaar_number = $1`, [aadhaar_number]);
        await client.query('COMMIT');
        res.status(200).json({ success: true, message: "Check-in successful" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: "Check-in failed" });
    } finally { client.release(); }
};

// 4. FETCH ALL
exports.getAllCriminals = async (req, res) => {
    try {
        const result = await db.query(`SELECT name, alias_name, section_type, ps_name, is_compliant, last_photo_uploaded_at, externment_end_date FROM externed_individuals ORDER BY last_photo_uploaded_at DESC NULLS FIRST`);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 5. REGISTER OFFICER
exports.registerOfficer = async (req, res) => {
    const { name, buckle_number, rank, role, police_station, mobile, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(`INSERT INTO officers (name, buckle_number, rank, role, police_station, mobile, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name`, [name, buckle_number, rank, role, police_station, mobile.trim(), hashedPassword]);
        res.status(201).json({ message: "Officer registered", officer: result.rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
};