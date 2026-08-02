//repositories communicate with the database
const pool = require("../config/database");

//retrieves every user from the users table
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

async function findByName(name) {
	const [rows] = await pool.query(
		"SELECT id, name, email, password_hash FROM users WHERE LOWER(name) = LOWER(?)",
		[name]
	);
	return rows[0] || null;
}

async function create({ name, email, passwordHash }) {
	const [result] = await pool.query(
		"INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
		[name, email || null, passwordHash || null]
	);
	return findById(result.insertId);
}

module.exports = { findAll, findById, findByEmail, findByName, create };
