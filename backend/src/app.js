require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");

const usersRoutes = require("./routes/users.routes");
const reportsRoutes = require("./routes/reports.routes");
const personsRoutes = require("./routes/persons.routes");
const categoriesRoutes = require("./routes/categories.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Neighborhood Watch API", endpoints: "/api/users, /api/reports, /api/persons, /api/categories" });
});

app.get("/health", async (req, res) => {
	await pool.query("SELECT 1");
	res.json({ status: "ok" });
});

app.use("/api/users", usersRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/persons", personsRoutes);
app.use("/api/categories", categoriesRoutes);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3000;

//retry until MySQL is reachable, so the backend survives mysql's slow startup.
async function waitForDatabase(retries = 20) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			await pool.query("SELECT 1");
			console.log("Connected to MySQL");
			return;
		} catch {
			console.log(`Waiting for MySQL... (${attempt}/${retries})`);
			await new Promise((resolve) => setTimeout(resolve, 3000));
		}
	}
	throw new Error("Could not connect to MySQL after multiple attempts");
}

waitForDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error(err.message);
		process.exit(1);
	});

app.post("/users", (req, res) => {
	res.json({
		message: "User created",
	});
});

