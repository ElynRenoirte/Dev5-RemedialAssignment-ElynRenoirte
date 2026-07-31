const pool = require("../config/database");

async function findAll() {
	const [rows] = await pool.query("SELECT id, name FROM categories ORDER BY name");
	return rows;
}

async function findById(id) {
	const [rows] = await pool.query("SELECT id, name FROM categories WHERE id = ?", [id]);
	return rows[0] || null;
}

async function findByName(name) {
	const [rows] = await pool.query("SELECT id, name FROM categories WHERE name = ?", [name]);
	return rows[0] || null;
}

async function create(name) {
	const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
	return findById(result.insertId);
}

module.exports = { findAll, findById, findByName, create };
