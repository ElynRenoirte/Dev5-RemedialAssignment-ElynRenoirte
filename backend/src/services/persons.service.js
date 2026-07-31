const personsRepository = require("../repositories/persons.repository");
const { httpError } = require("../utils/httpError");

//get all persons
async function getAll() {
	return personsRepository.findAll();
}

//get a person and throw 404 if missing
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

//reuse an existing person by name, or register a new observed person.
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
