//error handling, creates standard http errors
function httpError(status, message) {
	const error = new Error(message);
	error.status = status;
	return error;
}

module.exports = { httpError };
