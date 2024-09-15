import router from "./router.js"

function listenerCallback42() {


	const urlParams = new URLSearchParams(window.location.search);
	const myParam = urlParams.get('code');

	const init = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(myParam)
	
	};
	call_local_api(init);
};

async function call_local_api(init) {
	try {
		let hostnameport = "https://" + window.location.host
		const response = await fetch(hostnameport + '/api/players/authorize_fortytwo/', init);

		if (response.status === 200) {

			const data = await response.json();

			sessionStorage.setItem("username", data["username"]);
			sessionStorage.setItem("email", data["email"]);
			if (data["avatar"])
				sessionStorage.setItem("avatar", data["avatar"]);
			if (data["nickname"])
				sessionStorage.setItem("nickname", data["nickname"]);
			sessionStorage.setItem("access", data["access"]); //pour lolo

			// Manually call the hide function of the boostrap Modal element
			//var modal = bootstrap.Modal.getOrCreateInstance('#modal__login');
			//await modal.hide();

			document.getElementById("login").textContent = "Logout";
			document.getElementById("login").value = "logout";
			router("index");
			document.getElementById("welcometxt").textContent = "Welcome " + sessionStorage.getItem("username");

		}
	}
	catch (e) {
		console.error("Error create user42: ", e);
	}
};

async function loadLogin42() {

	// document.querySelectorAll(".dropdown-item").forEach(btn => {
	// 	btn.setAttribute("disabled", true);
	// });
	// document.getElementById("topbar__logout").setAttribute("disabled", true);

	try {
		let hostnameport = "https://" + window.location.host
		const response = await fetch(hostnameport + '/api/players/authorize_fortytwo');

		if (response.status === 200) {

			// document.querySelectorAll(".dropdown-item").forEach(btn => {
			// 	btn.removeAttribute("disabled");
			// });
			// document.getElementById("topbar__logout").removeAttribute("disabled");

			router("index");
		}
		return 1;
	} catch (e) {
		console.error(e);
	}
};

export default {
	listenerCallback42,
	loadLogin42
};

