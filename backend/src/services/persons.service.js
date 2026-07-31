const personsRepository = require("../repositories/persons.repository");
const { httpError } = require("../utils/httpError");

async function getAll() {
	return personsRepository.findAll();
}

async function getById(id) {
	const person = await personsRepository.findById(id);
	if (!person) {
		throw httpError(404, "Person not found");
	}
	return person;
}

async function create(name) {
	return personsRepository.create(name);
}

// Reuse an existing person by name, or register a new observed person.
async function getOrCreate(name) {
	const existing = await personsRepository.findByName(name);
	if (existing) {
		return existing;
	}
	return personsRepository.create(name);
}

async function getTrajectory(id) {
	const person = await getById(id);
	const points = await personsRepository.findTrajectory(id);
	return { person, points };
}

module.exports = { getAll, getById, create, getOrCreate, getTrajectory };
