import router from "./router.js"

var csrftoken;

async function updateNickname(nicknameForm) {

	const msgElement = document.getElementById("form__updateNickname--msg");

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-success");

	const input = nicknameForm.elements;

	const usernameRegex = /^[a-zA-Z0-9@./+\-_]{1,150}$/g;
	if (!input.nickname.value.match(usernameRegex)){
		msgElement.textContent = "Invalid nickname";
		msgElement.classList.add("text-danger");
		return;
	}

	sessionStorage.setItem("nickname", input.nickname.value); // TO DELETE AFTER BACKEND !
	msgElement.textContent = "Nickname changed"; // TO DELETE AFTER BACKEND !
	msgElement.classList.remove("text-danger"); // TO DELETE AFTER BACKEND !
	msgElement.classList.add("text-success"); // TO DELETE AFTER BACKEND !

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

	// 		msgElement.textContent = "Nickname changed";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-success");

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
	msgElement.classList.remove("text-success");

	const input = usernameForm.elements;

	const usernameRegex = /^[a-zA-Z0-9@./+\-_]{1,150}$/g;
	if (!input.username.value.match(usernameRegex)){
		msgElement.textContent = "Invalid username";
		msgElement.classList.add("text-danger");
		return;
	}

	sessionStorage.setItem("username", input.username.value); // TO DELETE AFTER BACKEND !
	msgElement.textContent = "Username changed"; // TO DELETE AFTER BACKEND !
	msgElement.classList.remove("text-danger"); // TO DELETE AFTER BACKEND !
	msgElement.classList.add("text-success"); // TO DELETE AFTER BACKEND !

	// const init = {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'X-CSRFToken': csrftoken,
	// 	},
	// 	body: JSON.stringify({username: input.username.value}),
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

	// 		sessionStorage.setItem("username", data.username);

	// 		msgElement.textContent = "Username changed";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-success");

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
	msgElement.classList.remove("text-success");

	const input = emailForm.elements;

	if (!input.email.value) {
		msgElement.textContent = "Invalid email";
		msgElement.classList.add("text-danger");
		return;
	}

	sessionStorage.setItem("email", input.email.value); // TO DELETE AFTER BACKEND !
	msgElement.textContent = "Email changed"; // TO DELETE AFTER BACKEND !
	msgElement.classList.remove("text-danger"); // TO DELETE AFTER BACKEND !
	msgElement.classList.add("text-success"); // TO DELETE AFTER BACKEND !

	// const init = {
	// 	method: 'PATCH',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'X-CSRFToken': csrftoken,
	// 	},
	// 	body: JSON.stringify({email: input.email.value}),
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

	// 		sessionStorage.setItem("email", data.email);

	// 		msgElement.textContent = "Email changed";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-success");

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
	msgElement.classList.remove("text-success");

	if (input["password_one"].value !== input["password_two"].value || !input.password_one.value) {
		msgElement.textContent = "Password not confirmed";
		msgElement.classList.add("text-danger");
		msgElement.classList.remove("text-success");
		return;
	}

	sessionStorage.setItem("password", input.password_one.value); // TO DELETE AFTER BACKEND !
	msgElement.textContent = "Password changed"; // TO DELETE AFTER BACKEND !
	msgElement.classList.remove("text-danger"); // TO DELETE AFTER BACKEND !
	msgElement.classList.add("text-success"); // TO DELETE AFTER BACKEND !

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

	// 		msgElement.textContent = "Password changed";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-success");
	// 	}
	// } catch (e) {
	// 	console.error(e);
	// }
};

async function updateAvatar() {

	const msgElement = document.getElementById("form__updateAvatar--msg");

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-success");

	sessionStorage.setItem("avatar", URL.createObjectURL(document.getElementById("form__updateAvatar--input").files[0])); // TO DELETE AFTER BACKEND !
	msgElement.textContent = "Avatar changed"; // TO DELETE AFTER BACKEND !
	msgElement.classList.remove("text-danger"); // TO DELETE AFTER BACKEND !
	msgElement.classList.add("text-success"); // TO DELETE AFTER BACKEND !

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

	// 		msgElement.textContent = "Avatar changed";
	// 		msgElement.classList.remove("text-danger");
	// 		msgElement.classList.add("text-success");

	// 		window.location.reload();
	// 	}
	// } catch (e) {
	// 	console.error(e);
	// }
};

function listenerUserInfo() {

	document.getElementById("update__avatar--big").src = sessionStorage.getItem("avatar") !== null ?
		sessionStorage.getItem("avatar") : "/frontend/img/avatar.png";
	document.getElementById("update__username--big").textContent = sessionStorage.getItem("username");
	document.getElementById("update__nickname--big").textContent = sessionStorage.getItem("nickname");
	document.getElementById("update__email--big").textContent = sessionStorage.getItem("email");

	const nicknameForm = document.getElementById("form__updateNickname");
	const usernameForm = document.getElementById("form__updateUsername");
	const passwordForm = document.getElementById("form__updatePassword");
	const avatarForm = document.getElementById("form__updateAvatar");
	const emailForm = document.getElementById("form__updateEmail");

	// Reset all fields (input and error) from the form when the modal pass to hidden
	document.getElementById("modal__updateAvatar").addEventListener("hidden.bs.modal", e => {
		e.preventDefault();
		avatarForm.querySelectorAll(".input__field").forEach(inputElement => {
			inputElement.value = "";
			document.getElementById("form__updateAvatar--msg").textContent = "";
		});
		});
	document.getElementById("modal__updateNickname").addEventListener("hidden.bs.modal", e => {
		e.preventDefault();
		nicknameForm.querySelectorAll(".input__field").forEach(inputElement => {
			inputElement.value = "";
			document.getElementById("form__updateNickname--msg").textContent = "";
		});
		});
	document.getElementById("modal__updateUsername").addEventListener("hidden.bs.modal", e => {
		e.preventDefault();
		usernameForm.querySelectorAll(".input__field").forEach(inputElement => {
			inputElement.value = "";
			document.getElementById("form__updateUsername--msg").textContent = "";
		});
			});
	document.getElementById("modal__updateEmail").addEventListener("hidden.bs.modal", e => {
		e.preventDefault();
		emailForm.querySelectorAll(".input__field").forEach(inputElement => {
			inputElement.value = "";
			document.getElementById("form__updateEmail--msg").textContent = "";
		});
			});
	document.getElementById("modal__updatePassword").addEventListener("hidden.bs.modal", e => {
		e.preventDefault();
		passwordForm.querySelectorAll(".input__field").forEach(inputElement => {
			inputElement.value = "";
			document.getElementById("form__updatePassword--msg").textContent = "";
		});
			});

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
