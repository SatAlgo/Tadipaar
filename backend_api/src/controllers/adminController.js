const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.createExternedPerson = async (req, res) => {
    const { full_name, mobile_number, password, case_id, assigned_city } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1️⃣ Create base user
        const userResult = await pool.query(
            `INSERT INTO users (full_name, mobile_number, password, role)
             VALUES ($1, $2, $3, 'externed')
             RETURNING id`,
            [full_name, mobile_number, hashedPassword]
        );

        const userId = userResult.rows[0].id;

        // 2️⃣ Create externed profile
        await pool.query(
            `INSERT INTO externed_persons (user_id, case_id, assigned_city)
             VALUES ($1, $2, $3)`,
            [userId, case_id, assigned_city]
        );

        res.status(201).json({ message: "Externed person created successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};