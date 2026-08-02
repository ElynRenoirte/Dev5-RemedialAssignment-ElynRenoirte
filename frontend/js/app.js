const API_URL = "http://localhost:3000/api";

//the logged-in user saved by the login page
const user = JSON.parse(localStorage.getItem("neighborhood-watch-user") || "null");
if (!user) {
	window.location.replace("login.html");
}

const logoutLink = document.getElementById("logout");
logoutLink.textContent = `Log out (${user.name})`;
logoutLink.addEventListener("click", () => localStorage.removeItem("neighborhood-watch-user"));

//the user id comes from the logged-in user, not from the form
const userIdField = document.getElementById("user-id");
userIdField.value = user.id;
userIdField.type = "hidden";
const userIdLabel = document.querySelector('label[for="user-id"]');
if (userIdLabel) {
	userIdLabel.remove();
}

//building the map
const map = L.map("map").setView([51.05, 3.72], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//the reporting area: in and around Ghent
const GHENT_SW = { lat: 50.95, lng: 3.6 };
const GHENT_NE = { lat: 51.15, lng: 3.85 };
const GHENT_BOUNDS = L.latLngBounds(
	L.latLng(GHENT_SW.lat, GHENT_SW.lng),
	L.latLng(GHENT_NE.lat, GHENT_NE.lng)
);

//users can only look at and report within this area
map.setMaxBounds(GHENT_BOUNDS);
map.setMinZoom(12);

L.rectangle(GHENT_BOUNDS, {
	color: "#6b7280",
	weight: 1,
	dashArray: "4 4",
	fill: false,
}).addTo(map);

function isNearGhent(lat, lng) {
	return (
		lat >= GHENT_SW.lat && lat <= GHENT_NE.lat &&
		lng >= GHENT_SW.lng && lng <= GHENT_NE.lng
	);
}

const reportLayer = L.layerGroup().addTo(map);

const colorByCategory = {
	stranger: "#dc2626",
	thief: "#7f1d1d",
	"missing person": "#2563eb",
	suspicious: "#ea580c",
	"known neighbor": "#16a34a",
};
const DEFAULT_COLOR = "#6b7280";

function colorFor(categoryName) {
	return colorByCategory[categoryName] || DEFAULT_COLOR;
}

//adds a dot on the map for a report
function addReportDot(report) {
	const lat = Number(report.latitude);
	const lng = Number(report.longitude);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return;
	}

	const marker = L.circleMarker([lat, lng], {
		radius: 8,
		color: "#ffffff",
		weight: 2,
		fillColor: colorFor(report.category),
		fillOpacity: 0.9,
	}).addTo(reportLayer);

	marker.bindPopup(
		`<strong>${report.person || "Sighting"}</strong><br/>` +
			`<strong>${report.category || "n/a"}</strong><br/>` +
			`${report.description}<br/>` +
			`<small>${report.reporter} &middot; ${new Date(report.created_at).toLocaleString()}</small>`
	);
}

//fills the "recent reports" list
function renderRecentList(reports) {
	const list = document.getElementById("recent-reports");
	list.innerHTML = "";

	if (reports.length === 0) {
		list.innerHTML = "<li>No reports yet.</li>";
		return;
	}

	reports.forEach((report) => {
		const li = document.createElement("li");
		const when = new Date(report.created_at).toLocaleString();
		li.innerHTML =
			`<strong>${report.person || "Sighting"}</strong> (${report.category || "n/a"})<br/>` +
			`<small>${report.description}</small><br/>` +
			`<small>${report.reporter} &middot; ${when}</small>`;
		list.appendChild(li);
	});
}

function renderReports(reports) {
	reportLayer.clearLayers();
	reports.forEach(addReportDot);
	renderRecentList(reports);
}

//renders the statistics under the map, re-fetches after every report submit so the statistics change live as data is added
function renderStats(stats) {
	document.getElementById("stat-total").textContent = stats.totalReports;

	const fillList = (elementId, items, format) => {
		const el = document.getElementById(elementId);
		el.innerHTML = "";
		if (items.length === 0) {
			el.innerHTML = "<li>No data yet.</li>";
			return;
		}
		items.forEach((item) => {
			const li = document.createElement("li");
			format(li, item);
			el.appendChild(li);
		});
	};

	fillList("stat-users", stats.activeUsers, (li, item) => {
		li.textContent = `${item.name} - ${item.report_count}`;
	});

	fillList("stat-persons", stats.mostReportedPersons, (li, item) => {
		li.textContent = `${item.name} - ${item.report_count}`;
	});

	fillList("stat-categories", stats.byCategory, (li, item) => {
		li.textContent = `${item.name || "uncategorized"} - ${item.report_count}`;
	});

	//areas are named places and clickable to move the map there
	fillList("stat-areas", stats.topAreas, (li, item) => {
		li.textContent = `${item.name} - ${item.report_count}`;
		if (item.latitude != null && item.longitude != null) {
			li.classList.add("stat-area");
			li.addEventListener("click", () => map.setView([item.latitude, item.longitude], 14));
		}
	});
}

async function loadStats() {
	const res = await fetch(`${API_URL}/reports/stats`);
	if (!res.ok) {
		throw new Error("Failed to load stats");
	}
	renderStats(await res.json());
}

//loads all reports from the database
async function loadReports() {
	const res = await fetch(`${API_URL}/reports`);
	if (!res.ok) {
		throw new Error("Failed to load reports");
	}
	renderReports(await res.json());
}

//loads the categories into the dropdown
async function loadCategories() {
	const res = await fetch(`${API_URL}/categories`);
	if (!res.ok) {
		throw new Error("Failed to load categories");
	}
	const categories = await res.json();
	const select = document.getElementById("category");
	categories.forEach((category) => {
		const option = document.createElement("option");
		option.value = category.id;
		option.textContent = category.name;
		select.appendChild(option);
	});
}

const form = document.getElementById("report-form");
const formError = document.getElementById("form-error");

//pick the location by clicking on the map (always inside the Ghent area)
map.on("click", (event) => {
	form.latitude.value = event.latlng.lat.toFixed(6);
	form.longitude.value = event.latlng.lng.toFixed(6);
});

function showError(message) {
	formError.textContent = message;
	formError.hidden = false;
}

function clearError() {
	formError.hidden = true;
	formError.textContent = "";
}

//submits a report: POST -> database -> dot appears on the map
form.addEventListener("submit", async (event) => {
	event.preventDefault();
	clearError();

	const payload = {
		userId: user.id,
		categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
		personName: form.personName.value.trim(),
		description: form.description.value.trim(),
		latitude: Number(form.latitude.value),
		longitude: Number(form.longitude.value),
		direction: form.direction.value.trim().toUpperCase() || null,
	};

	if (!isNearGhent(payload.latitude, payload.longitude)) {
		showError("The location must be in or around Ghent.");
		return;
	}

	try {
		const res = await fetch(`${API_URL}/reports`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			showError(err.error || (err.errors ? err.errors.join("\n") : "Something went wrong"));
			return;
		}

		//reload from the database so map, recent list and stats show the new report
		const reports = await (await fetch(`${API_URL}/reports`)).json();
		renderReports(reports);
		loadStats().catch(() => {});
		map.setView([payload.latitude, payload.longitude], 15);
		form.reset();

		//form.reset() re-shows the user id field, so hide it again
		userIdField.value = user.id;
		userIdField.type = "hidden";
	} catch (err) {
		showError(`Could not reach the server: ${err.message}`);
	}
});

loadReports().catch((err) => showError(`Could not load reports: ${err.message}`));
loadStats().catch((err) => showError(`Could not load statistics: ${err.message}`)); //re-fetches after every report submit, so the statistics change live as data is added
loadCategories().catch((err) => console.error(err));
