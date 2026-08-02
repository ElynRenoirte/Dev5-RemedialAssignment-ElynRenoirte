//login page
const API_URL = "http://localhost:3000/api";

document.getElementById("login-form").addEventListener("submit", async (event) => {
	event.preventDefault();
	const form = event.target;
	const errorEl = document.getElementById("login-error");
	errorEl.hidden = true;

	const res = await fetch(`${API_URL}/users/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: form.name.value, password: form.password.value }),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		errorEl.textContent = err.error || JSON.stringify(err.errors || err);
		errorEl.hidden = false;
		return;
	}

	const user = await res.json();
	localStorage.setItem("neighborhood-watch-user", JSON.stringify(user));
	window.location.href = "index.html";
});
