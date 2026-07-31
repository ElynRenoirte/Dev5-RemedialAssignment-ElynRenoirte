const pool = require("../config/database");

async function findAll() {
	const [rows] = await pool.query(
		"SELECT id, name, email, created_at FROM users ORDER BY name"
	);
	return rows;
}

async function findById(id) {
	const [rows] = await pool.query(
		"SELECT id, name, email, created_at FROM users WHERE id = ?",
		[id]
	);
	return rows[0] || null;
}

async function findByEmail(email) {
	const [rows] = await pool.query(
		"SELECT id, name, email FROM users WHERE email = ?",
		[email]
	);
	return rows[0] || null;
}

async function create({ name, email }) {
	const [result] = await pool.query(
		"INSERT INTO users (name, email) VALUES (?, ?)",
		[name, email]
	);
	return findById(result.insertId);
}

module.exports = { findAll, findById, findByEmail, create };
