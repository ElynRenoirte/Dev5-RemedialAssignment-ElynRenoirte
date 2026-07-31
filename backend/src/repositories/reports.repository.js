const pool = require("../config/database");

const REPORT_COLUMNS = `
	r.id, r.user_id, r.category_id, r.person_id, r.description,
	r.latitude, r.longitude, r.direction, r.created_at,
	u.name AS reporter, p.name AS person, c.name AS category
`;

const REPORT_JOINS = `
	FROM reports r
	JOIN users u ON u.id = r.user_id
	LEFT JOIN persons p ON p.id = r.person_id
	LEFT JOIN categories c ON c.id = r.category_id
`;

async function findAll() {
	const [rows] = await pool.query(
		`SELECT ${REPORT_COLUMNS} ${REPORT_JOINS} ORDER BY r.created_at DESC`
	);
	return rows;
}

async function findById(id) {
	const [rows] = await pool.query(
		`SELECT ${REPORT_COLUMNS} ${REPORT_JOINS} WHERE r.id = ?`,
		[id]
	);
	return rows[0] || null;
}

async function findByUser(userId) {
	const [rows] = await pool.query(
		`SELECT ${REPORT_COLUMNS} ${REPORT_JOINS} WHERE r.user_id = ? ORDER BY r.created_at DESC`,
		[userId]
	);
	return rows;
}

async function create(report) {
	const [result] = await pool.query(
		`INSERT INTO reports
			(user_id, category_id, person_id, description, latitude, longitude, direction)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[
			report.user_id,
			report.category_id,
			report.person_id,
			report.description,
			report.latitude,
			report.longitude,
			report.direction,
		]
	);
	return findById(result.insertId);
}

module.exports = { findAll, findById, findByUser, create };
