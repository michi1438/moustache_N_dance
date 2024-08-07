import router from "./router.js"

var csrftoken;

async function updateNickname(nicknameForm) {

	const msgElement = document.getElementById("form__updateNickname--msg");

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-info");

	const input = nicknameForm.elements;

	const usernameRegex = /^[a-zA-Z0-9@./+\-_]{1,150}$/g;
	if (!input.nickname.value.match(usernameRegex)){
		msgElement.textContent = "Invalid nickname";
		msgElement.classList.add("text-danger");
		return;
	}

	sessionStorage.setItem("nickname", input.nickname.value);

	// 		msgElement.textContent = "Ton nouveau nickname à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

	// 		window.location.reload();

	// const init = {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'X-CSRFToken': csrftoken,
	// 	},
	// 	body: JSON.stringify({nickname: input.nickname.value}),
	// };

	// try {
	// 	let hostnameport = "https://" + window.location.host

	// 	const response = await fetch(hostnameport + '/api/profile/', init);

	// 	if (response.status != 200) {

	// 		const error = await response.text();
			

			
	// 		msgElement.textContent = error.replace(/["{}[\]]/g, '');
	// 		msgElement.classList.add("text-danger");
	// 		return;
	// 	}
	// 	if (response.status === 200) {
	// 		const data = await response.json();

	// 		sessionStorage.setItem("nickname", data.nickname);

	// 		msgElement.textContent = "Ton nouveau nickname à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

	// 		window.location.reload();
	// 	}

	// } catch (e) {
	// 	console.error(e);
	// }
};

async function updateUsername(usernameForm) {

	const msgElement = document.getElementById("form__updateUsername--msg");

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-info");

	const input = usernameForm.elements;

	const usernameRegex = /^[a-zA-Z0-9@./+\-_]{1,150}$/g;
	if (!input.username.value.match(usernameRegex)){
		msgElement.textContent = "Invalid username";
		msgElement.classList.add("text-danger");
		return;
	}

	sessionStorage.setItem("username", input.username.value);

	// 		msgElement.textContent = "Ton nouveau nickname à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

	// 		window.location.reload();

	// const init = {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'X-CSRFToken': csrftoken,
	// 	},
	// 	body: JSON.stringify({nickname: input.nickname.value}),
	// };

	// try {
	// 	let hostnameport = "https://" + window.location.host

	// 	const response = await fetch(hostnameport + '/api/profile/', init);

	// 	if (response.status != 200) {

	// 		const error = await response.text();
			

			
	// 		msgElement.textContent = error.replace(/["{}[\]]/g, '');
	// 		msgElement.classList.add("text-danger");
	// 		return;
	// 	}
	// 	if (response.status === 200) {
	// 		const data = await response.json();

	// 		sessionStorage.setItem("nickname", data.nickname);

	// 		msgElement.textContent = "Ton nouveau nickname à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

	// 		window.location.reload();
	// 	}

	// } catch (e) {
	// 	console.error(e);
	// }
};

async function updateEmail(emailForm) {

	const msgElement = document.getElementById("form__updateEmail--msg");

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-info");

	const input = emailForm.elements;

	if (!input.email.value) {
		msgElement.textContent = "Invalid email";
		msgElement.classList.add("text-danger");
		return;
	}

	sessionStorage.setItem("email", input.email.value);

	// 		msgElement.textContent = "Ton nouveau nickname à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

	// 		window.location.reload();

	// const init = {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'X-CSRFToken': csrftoken,
	// 	},
	// 	body: JSON.stringify({nickname: input.nickname.value}),
	// };

	// try {
	// 	let hostnameport = "https://" + window.location.host

	// 	const response = await fetch(hostnameport + '/api/profile/', init);

	// 	if (response.status != 200) {

	// 		const error = await response.text();
			

			
	// 		msgElement.textContent = error.replace(/["{}[\]]/g, '');
	// 		msgElement.classList.add("text-danger");
	// 		return;
	// 	}
	// 	if (response.status === 200) {
	// 		const data = await response.json();

	// 		sessionStorage.setItem("nickname", data.nickname);

	// 		msgElement.textContent = "Ton nouveau nickname à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

	// 		window.location.reload();
	// 	}

	// } catch (e) {
	// 	console.error(e);
	// }
};

async function updatePassword(passwordForm) {

	const msgElement = document.getElementById("form__updatePassword--msg");
	const input = passwordForm.elements;

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-info");

	if (input["password_one"].value !== input["password_two"].value || !input.password_one.value) {
		msgElement.textContent = "Password not confirmed";
		msgElement.classList.add("text-danger");
		msgElement.classList.remove("text-success");
		return;
	}

	sessionStorage.setItem("password", input.password_one.value);

	// const init = {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'X-CSRFToken': csrftoken,
	// 	},
	// 	body: JSON.stringify({password: input.password_one.value})
	// };

	// try {

	// 	let hostnameport = "https://" + window.location.host

	// 	const response = await fetch(hostnameport + '/api/updatepassword/', init);

	// 	if (response.status != 200) {
	// 		const error = await response.text();
	// 		console.log("undpate password", error)
	// 		msgElement.textContent = error.replace(/["{}[\]]/g, '');
	// 		msgElement.classList.add("text-danger");
	// 		return;
	// 	}
	// 	if (response.status === 200) {
	// 		const data = await response.json();

	// 		msgElement.textContent = "Ton nouveau mot de passe à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");
	// 	}
	// } catch (e) {
	// 	console.error(e);
	// }
};

async function updateAvatar() {

	const msgElement = document.getElementById("form__update--avatar--msg");

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-info");

	sessionStorage.setItem("avatar", document.getElementById("form__update--avatar--input").files[0]);
	sessionStorage.setItem("avatar2", "/frontend/img/avatar.png"); //to delete

	// 		msgElement.textContent = "Ton nouvel avatar à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

			// window.location.reload();

	// const init = {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'X-CSRFToken': csrftoken,
	// 	},
	// 	body: data,
	// };

	// try {

	// 	let hostnameport = "https://" + window.location.host

	// 	const response = await fetch(hostnameport + '/api/updateavatar/', init);

	// 	if (response.status === 400) {
	// 		const error = await response.text();

	// 		msgElement.textContent = error.replace(/["{}[\]]/g, '');
	// 		msgElement.classList.add("text-danger");
	// 		return;
	// 	}
	// 	if (response.status === 200) {
	// 		const data = await response.json();

	// 		sessionStorage.setItem("avatar", data.avatar);

	// 		msgElement.textContent = "Ton nouvel avatar à été sauvegardé.";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-info");

	// 		window.location.reload();
	// 	}
	// } catch (e) {
	// 	console.error(e);
	// }
};

function listenerUserInfo() {

	document.getElementById("update__avatar--big").src = sessionStorage.getItem("avatar") !== null ?
		sessionStorage.getItem("avatar") : "/frontend/img/avatar.png"; //to change to "avatar"
	document.getElementById("update__username--big").textContent = sessionStorage.getItem("username");
	document.getElementById("update__nickname--big").textContent = sessionStorage.getItem("nickname");
	document.getElementById("update__email--big").textContent = sessionStorage.getItem("email");

	const nicknameForm = document.getElementById("form__updateNickname");
	const usernameForm = document.getElementById("form__updateUsername");
	const passwordForm = document.getElementById("form__updatePassword");
	const avatarForm = document.getElementById("form__update--avatar");
	const emailForm = document.getElementById("form__updateEmail");

	nicknameForm.addEventListener("submit", e => {
		e.preventDefault();

		updateNickname(nicknameForm);
	});

	usernameForm.addEventListener("submit", e => {
		e.preventDefault();

		updateUsername(usernameForm);
	});

	passwordForm.addEventListener("submit", e => {
		e.preventDefault();

		updatePassword(passwordForm);
	});

	emailForm.addEventListener("submit", e => {
		e.preventDefault();

		updateEmail(emailForm);
	});

	avatarForm.addEventListener("submit", e => {
		e.preventDefault();

		updateAvatar();
	});
};

// async function loadUpdateInfo() {

// 	csrftoken = document.cookie.split("; ").find((row) => row.startsWith("csrftoken"))?.split("=")[1];

// 	const init = {
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'X-CSRFToken': csrftoken,
// 		}
// 	};

// 	try {

// 		let hostnameport = "https://" + window.location.host

// 		const response = await fetch(hostnameport + '/api/profile/', init);

// 		if (!response.ok) {
// 			const text = await response.text();
// 			throw new Error(text.replace(/["{}[\]]/g, ''));
// 		}

// 		return 1;
// 	} catch (e) {
// 		console.error("loadUpdateInfor: " + e);
// 		return 0;
// 	}
// };

export default {
	listenerUserInfo,
	// loadUpdateInfo
};
