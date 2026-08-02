const pool = require("../config/database");

//stores columns as constant
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

//aggregates report statistics for the statistic panel under the map
async function getStats() {
	const [totalRows] = await pool.query("SELECT COUNT(*) AS total FROM reports");

	const [activeUsers] = await pool.query(
		`SELECT u.name, COUNT(r.id) AS report_count
		 FROM reports r
		 JOIN users u ON u.id = r.user_id
		 GROUP BY u.id, u.name
		 ORDER BY report_count DESC, u.name
		 LIMIT 5`
	);

	const [mostReportedPersons] = await pool.query(
		`SELECT p.name, COUNT(r.id) AS report_count
		 FROM reports r
		 JOIN persons p ON p.id = r.person_id
		 GROUP BY p.id, p.name
		 ORDER BY report_count DESC, p.name
		 LIMIT 5`
	);

	const [byCategory] = await pool.query(
		`SELECT c.name, COUNT(r.id) AS report_count
		 FROM reports r
		 LEFT JOIN categories c ON c.id = r.category_id
		 GROUP BY c.id, c.name
		 ORDER BY report_count DESC, c.name`
	);

	//moest reported areas, areas are grouped by rounding lat/lng to 2 decimals (roughly a 1km grid cell)
	const [topAreas] = await pool.query(
		`SELECT ROUND(latitude, 2) AS latitude, ROUND(longitude, 2) AS longitude,
				COUNT(*) AS report_count
		 FROM reports
		 GROUP BY ROUND(latitude, 2), ROUND(longitude, 2)
		 ORDER BY report_count DESC, latitude, longitude
		 LIMIT 5`
	);

	return {
		totalReports: totalRows[0].total,
		activeUsers,
		mostReportedPersons,
		byCategory,
		topAreas,
	};
}

//insert new report
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

module.exports = { findAll, findById, findByUser, getStats, create };
