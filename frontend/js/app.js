const API_URL = "http://localhost:3000/api";

const user = JSON.parse(localStorage.getItem("neighborhood-watch-user") || "null");
if (!user) {
	window.location.replace("login.html");
}

const logoutLink = document.getElementById("logout");
logoutLink.textContent = `Log out (${user.name})`;
logoutLink.addEventListener("click", () => localStorage.removeItem("neighborhood-watch-user"));

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

const reportLayer = L.layerGroup().addTo(map);

//adds dot when report is submitted
function addReportDot(report) {
	const lat = Number(report.latitude);
	const lng = Number(report.longitude);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return;
	}

	const marker = L.circleMarker([lat, lng], {
		radius: 8,
		color: "#1e293b",
		weight: 2,
		fillColor: "#f59e0b",
		fillOpacity: 0.9,
	}).addTo(reportLayer);

	marker.bindPopup(
		`<strong>${report.person || "Sighting"}</strong><br/>` +
			`${report.description}<br/>` +
			`<small>${report.reporter} &middot; ${new Date(report.created_at).toLocaleString()}</small>`
	);
}

function fitBoundsToReports() {
	if (reportLayer.getLayers().length > 0) {
		map.fitBounds(reportLayer.getBounds(), { padding: [40, 40], maxZoom: 15 });
	}
}

//loads reports
async function loadReports() {
	const res = await fetch(`${API_URL}/reports`);
	if (!res.ok) {
		throw new Error("Failed to load reports");
	}
	const reports = await res.json();
	reports.forEach(addReportDot);
	fitBoundsToReports();
}

//loads categories
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

document.getElementById("report-form").addEventListener("submit", async (event) => {
	event.preventDefault();
	const form = event.target;

	const payload = {
		userId: user.id,
		categoryId: form.categoryId.value ? Number(form.categoryId.value) : null,
		personName: form.personName.value,
		description: form.description.value,
		latitude: Number(form.latitude.value),
		longitude: Number(form.longitude.value),
		direction: form.direction.value || null,
	};

	const res = await fetch(`${API_URL}/reports`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		alert(err.error || JSON.stringify(err.errors || err));
		return;
	}

	const report = await res.json();
	addReportDot(report);
	fitBoundsToReports();
	form.reset();
});

loadReports().catch((err) => console.error(err));
loadCategories().catch((err) => console.error(err));
