//validating incoming data before it is saved to the database or used by the application
const COMPASS_PATTERN = /^[NSEW]{1,2}$/; //checks if directions only contain NSEW

//validating latitude, longitude and email
function isValidLatitude(value) {
	return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value) {
	return Number.isFinite(value) && value >= -180 && value <= 180;
}

function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

//Ensures a route parameter like /users/:id is a positive integer.
function validateId(req, res, next) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		res.status(400).json({ error: "Invalid id, expected a positive integer" });
		return;
	}
	req.params.id = id;
	next();
}

//validates new user
function validateUser(body) {
	const errors = [];
	const name = typeof body.name === "string" ? body.name.trim() : "";
	const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

	if (!name || name.length < 2 || name.length > 100) {
		errors.push("name is required and must be 2-100 characters long");
	}
	if (!isValidEmail(email)) {
		errors.push("a valid email is required");
	}

	return { errors, value: { name, email } };
}

//validates neighborhood report
function validateReport(body) {
	const errors = [];
	const userId = Number(body.userId);
	const categoryId = body.categoryId != null ? Number(body.categoryId) : null;
	const personName = typeof body.personName === "string" ? body.personName.trim() : "";
	const description = typeof body.description === "string" ? body.description.trim() : "";
	const latitude = Number(body.latitude);
	const longitude = Number(body.longitude);
	const direction = typeof body.direction === "string" ? body.direction.trim().toUpperCase() : null;

	if (!Number.isInteger(userId) || userId <= 0) {
		errors.push("userId is required and must be a positive integer");
	}
	if (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0)) {
		errors.push("categoryId must be a positive integer");
	}
	if (!personName || personName.length > 100) {
		errors.push("personName is required and must be at most 100 characters");
	}
	if (description.length < 5 || description.length > 2000) {
		errors.push("description is required and must be 5-2000 characters long");
	}
	if (!isValidLatitude(latitude)) {
		errors.push("latitude must be a number between -90 and 90");
	}
	if (!isValidLongitude(longitude)) {
		errors.push("longitude must be a number between -180 and 180");
	}
	if (direction && !COMPASS_PATTERN.test(direction)) {
		errors.push("direction must be a compass direction like N, NE or SSE");
	}

	return {
		errors,
		value: { userId, categoryId, personName, description, latitude, longitude, direction },
	};
}

//validates categories
function validateCategory(body) {
	const errors = [];
	const name = typeof body.name === "string" ? body.name.trim().toLowerCase() : "";

	if (!name || name.length < 2 || name.length > 50) {
		errors.push("name is required and must be 2-50 characters long");
	}

	return { errors, value: { name } };
}

//validates persons (if name exists and max 100 characters)
function validatePerson(body) {
	const errors = [];
	const name = typeof body.name === "string" ? body.name.trim() : "";

	if (!name || name.length > 100) {
		errors.push("name is required and must be at most 100 characters");
	}

	return { errors, value: { name } };
}

module.exports = {
	validateId,
	validateUser,
	validateReport,
	validateCategory,
	validatePerson,
};
