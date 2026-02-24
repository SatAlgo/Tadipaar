const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Unified Login for both Officers and Criminals
exports.login = async (req, res) => {
    const { mobile, password } = req.body;
    console.log(`Login Attempt: ${mobile}`);

    try {
        // 1. Check Officers table
        let result = await db.query('SELECT * FROM officers WHERE mobile = $1', [mobile]);
        let user = null;

        if (result.rows.length > 0) {
            user = result.rows[0];
        } else {
            // 2. Check Criminals table
            result = await db.query('SELECT * FROM externed_individuals WHERE mobile = $1', [mobile]);
            if (result.rows.length > 0) {
                user = result.rows[0];
            }
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const userId = user.aadhaar_number || user.id;
        const token = jwt.sign(
            { id: userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: userId, name: user.name, role: user.role, mobile: user.mobile }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Register Officer (Used by Admin)
exports.registerOfficer = async (req, res) => {
    const { name, buckle_number, rank, role, police_station, mobile, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO officers (name, buckle_number, rank, role, police_station, mobile, password_hash) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, role`,
            [name, buckle_number, rank, role, police_station, mobile, hashedPassword]
        );
        res.status(201).json({ message: "Officer registered", officer: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Register Criminal (Used by Admin/Officer)
exports.registerCriminal = async (req, res) => {
    const { aadhaar_number, name, alias_name, case_number, mobile, password, order_expiry_date } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO externed_individuals (aadhaar_number, name, alias_name, case_number, mobile, password_hash, order_expiry_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING aadhaar_number, name`,
            [aadhaar_number, name, alias_name, case_number, mobile, hashedPassword, order_expiry_date]
        );
        res.status(201).json({ message: "Criminal registered", criminal: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};