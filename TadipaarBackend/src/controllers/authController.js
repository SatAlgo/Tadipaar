const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * UNIFIED LOGIN
 * No role column needed in externed_individuals
 */
exports.login = async (req, res) => {
    try {
        const mobile = req.body.mobile ? req.body.mobile.trim() : null;
        const { password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ message: "Mobile and password required" });
        }

        console.log(`Login Attempt: ${mobile}`);

        // 1. First, search in Officers Table
        let result = await db.query('SELECT * FROM officers WHERE mobile = $1', [mobile]);
        let user = null;
        let assignedRole = null;

        if (result.rows.length > 0) {
            user = result.rows[0];
            assignedRole = user.role; // Uses the role from the officers table (ADMIN, DCP, etc.)
            console.log(`User found in Officers. Role: ${assignedRole}`);
        } else {
            // 2. If not an officer, search in Criminals Table
            result = await db.query('SELECT * FROM externed_individuals WHERE mobile = $1', [mobile]);
            if (result.rows.length > 0) {
                user = result.rows[0];
                assignedRole = 'CRIMINAL'; // Hardcoded role since this table is only for criminals
                console.log(`User found in Criminals table.`);
            }
        }

        if (!user) {
            console.log(`Login Failed: ${mobile} not found.`);
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Verify Password (using password_hash column)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 4. Create JWT Token
        const userId = user.aadhaar_number || user.id;
        const token = jwt.sign(
            { id: userId, role: assignedRole },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Success Response
        res.json({
            token,
            user: {
                id: userId,
                name: user.name,
                role: assignedRole, // Frontend receives 'CRIMINAL' here
                mobile: user.mobile
            }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * REGISTER OFFICER (ADMIN ONLY)
 */
exports.registerOfficer = async (req, res) => {
    const { name, buckle_number, rank, role, police_station, mobile, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO officers (name, buckle_number, rank, role, police_station, mobile, password_hash) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, role`,
            [name, buckle_number, rank, role, police_station, mobile.trim(), hashedPassword]
        );
        res.status(201).json({ message: "Officer registered", officer: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * REGISTER CRIMINAL (ADMIN/OFFICER)
 * No role inserted into DB
 */
exports.registerCriminal = async (req, res) => {
    const { aadhaar_number, name, alias_name, case_number, mobile, password, order_expiry_date } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Note: is_compliant is still useful for the monitoring logic
        const result = await db.query(
            `INSERT INTO externed_individuals 
             (aadhaar_number, name, alias_name, case_number, mobile, password_hash, order_expiry_date, is_compliant) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, true) 
             RETURNING aadhaar_number, name`,
            [aadhaar_number, name, alias_name, case_number, mobile.trim(), hashedPassword, order_expiry_date]
        );
        res.status(201).json({ message: "Criminal registered", criminal: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * FETCH DATA
 */
exports.getAllCriminals = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT aadhaar_number, name, alias_name, case_number, is_compliant, mobile FROM externed_individuals ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * HANDLE CRIMINAL CHECK-IN
 * Logs GPS and Image path to database
 */
exports.handleCheckIn = async (req, res) => {
    try {
        const { latitude, longitude, aadhaar_number } = req.body;
        const imagePath = req.file ? req.file.path : null;

        if (!aadhaar_number) {
            return res.status(400).json({ error: "Aadhaar number is required for check-in" });
        }

        // 1. Save to a check_ins table (Make sure you created this table in PGAdmin)
        await db.query(
            `INSERT INTO check_ins (aadhaar_number, latitude, longitude, image_path) 
             VALUES ($1, $2, $3, $4)`,
            [aadhaar_number, latitude, longitude, imagePath]
        );

        // 2. Optional: Update the last known location/compliance in the individuals table
        await db.query(
            `UPDATE externed_individuals SET is_compliant = true WHERE aadhaar_number = $1`,
            [aadhaar_number]
        );

        console.log(`✅ Check-in Success: ${aadhaar_number} at ${latitude}, ${longitude}`);

        res.status(200).json({ 
            success: true, 
            message: "Check-in recorded successfully" 
        });

    } catch (err) {
        console.error("Check-in Error:", err.message);
        res.status(500).json({ error: "Failed to process check-in" });
    }
};

// Also adding the missing getAllOfficers if your routes use it
exports.getAllOfficers = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, buckle_number, rank, role, police_station, mobile FROM officers ORDER BY role ASC'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};