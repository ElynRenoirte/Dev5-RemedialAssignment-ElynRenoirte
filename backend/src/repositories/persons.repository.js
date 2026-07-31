const pool = require("../config/database");

async function findAll() {
	const [rows] = await pool.query(
		"SELECT id, name, created_at FROM persons ORDER BY name"
	);
	return rows;
}

async function findById(id) {
	const [rows] = await pool.query(
		"SELECT id, name, created_at FROM persons WHERE id = ?",
		[id]
	);
	return rows[0] || null;
}

async function findByName(name) {
	const [rows] = await pool.query(
		"SELECT id, name FROM persons WHERE name = ?",
		[name]
	);
	return rows[0] || null;
}

async function create(name) {
	const [result] = await pool.query("INSERT INTO persons (name) VALUES (?)", [name]);
	return findById(result.insertId);
}

// Ordered sightings of one observed person = their trajectory on the map.
async function findTrajectory(id) {
	const [rows] = await pool.query(
		`SELECT r.id, r.latitude, r.longitude, r.direction, r.created_at,
		        u.name AS reporter, c.name AS category
		 FROM reports r
		 JOIN users u ON u.id = r.user_id
		 LEFT JOIN categories c ON c.id = r.category_id
		 WHERE r.person_id = ?
		 ORDER BY r.created_at ASC`,
		[id]
	);
	return rows;
}

module.exports = { findAll, findById, findByName, create, findTrajectory };
