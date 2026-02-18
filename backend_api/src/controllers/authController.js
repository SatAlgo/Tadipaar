const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { mobile, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE mobile_number = $1 AND is_active = TRUE",
            [mobile]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            "SECRET_KEY",
            { expiresIn: "8h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            role: user.role
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};