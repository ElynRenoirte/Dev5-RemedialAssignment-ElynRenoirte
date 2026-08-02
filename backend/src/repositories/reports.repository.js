const pool = require("../config/database");

//named places list used to name the "most reported areas" statistic
const NAMED_PLACES = [
	{ name: "gent-sint-pieters", latitude: 51.0366, longitude: 3.7109 },
	{ name: "citadelpark", latitude: 51.039, longitude: 3.7235 },
	{ name: "korenmarkt", latitude: 51.0539, longitude: 3.7248 },
	{ name: "kouter", latitude: 51.0531, longitude: 3.7207 },
	{ name: "vrijdagmarkt", latitude: 51.056, longitude: 3.7269 },
	{ name: "sint-pietersplein", latitude: 51.0424, longitude: 3.7255 },
	{ name: "gent-dampoort", latitude: 51.0556, longitude: 3.7381 },
	{ name: "graslei", latitude: 51.0547, longitude: 3.7211 },
	{ name: "bijloke", latitude: 51.0439, longitude: 3.7163 },
	{ name: "blaarmeersen", latitude: 51.0446, longitude: 3.6878 },
	{ name: "ekkergem", latitude: 51.0511, longitude: 3.7055 },
	{ name: "gentbrugge", latitude: 51.0443, longitude: 51.0443 },
	{ name: "ledeberg", latitude: 51.0369, longitude: 3.7415 },
	{ name: "oostakker", latitude: 51.1, longitude: 3.7628 },
];

//reports further than this (in km) from any named place are grouped as "other"
const MAX_PLACE_DISTANCE_KM = 0.6;

function toRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

function distanceKm(lat1, lng1, lat2, lng2) {
	const earthRadiusKm = 6371;
	const dLat = toRadians(lat2 - lat1);
	const dLng = toRadians(lng2 - lng1);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
	return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

//returns the closest named place for a coordinate, or "other"
function nearestPlace(latitude, longitude) {
	let best = null;
	let bestDistance = Infinity;
	for (const place of NAMED_PLACES) {
		const distance = distanceKm(latitude, longitude, place.latitude, place.longitude);
		if (distance < bestDistance) {
			bestDistance = distance;
			best = place;
		}
	}
	if (!best || bestDistance > MAX_PLACE_DISTANCE_KM) {
		return null;
	}
	return best;
}

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
	const [rows] = await pool.query(`SELECT ${REPORT_COLUMNS} ${REPORT_JOINS} ORDER BY r.created_at DESC`);
	return rows;
}

async function findById(id) {
	const [rows] = await pool.query(`SELECT ${REPORT_COLUMNS} ${REPORT_JOINS} WHERE r.id = ?`, [id]);
	return rows[0] || null;
}

async function findByUser(userId) {
	const [rows] = await pool.query(`SELECT ${REPORT_COLUMNS} ${REPORT_JOINS} WHERE r.user_id = ? ORDER BY r.created_at DESC`, [userId]);
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
		 LIMIT 5`,
	);

	const [mostReportedPersons] = await pool.query(
		`SELECT p.name, COUNT(r.id) AS report_count
		 FROM reports r
		 JOIN persons p ON p.id = r.person_id
		 GROUP BY p.id, p.name
		 ORDER BY report_count DESC, p.name
		 LIMIT 5`,
	);

	const [byCategory] = await pool.query(
		`SELECT c.name, COUNT(r.id) AS report_count
		 FROM reports r
		 LEFT JOIN categories c ON c.id = r.category_id
		 GROUP BY c.id, c.name
		 ORDER BY report_count DESC, c.name`,
	);

	//most reported areas, each report is matched to the nearest named place
	const [areaRows] = await pool.query("SELECT latitude, longitude FROM reports");
	const areaCounts = {};
	const areaCoords = {};
	areaRows.forEach((row) => {
		const place = nearestPlace(row.latitude, row.longitude);
		const name = place ? place.name : "other";
		areaCounts[name] = (areaCounts[name] || 0) + 1;
		if (place) {
			areaCoords[name] = { latitude: place.latitude, longitude: place.longitude };
		}
	});
	const topAreas = Object.keys(areaCounts)
		.map((name) => ({
			name,
			report_count: areaCounts[name],
			latitude: areaCoords[name] ? areaCoords[name].latitude : null,
			longitude: areaCoords[name] ? areaCoords[name].longitude : null,
		}))
		.sort((a, b) => b.report_count - a.report_count || a.name.localeCompare(b.name))
		.slice(0, 5);

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
		[report.user_id, report.category_id, report.person_id, report.description, report.latitude, report.longitude, report.direction],
	);
	return findById(result.insertId);
}

module.exports = { findAll, findById, findByUser, getStats, create };
