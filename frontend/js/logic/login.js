import router from "./router.js"

async function verifyOTP(loginForm) {

	// remove a potential error message from the field
	document.getElementById("form__login--errorMsg").textContent = "";

	const input = loginForm.elements;

	const inputValues = {
		id: sessionStorage.getItem("id"),
		otp: input.otp.value,
	};

	if (!inputValues.otp) {
		document.getElementById("form__login--errorMsg").textContent = "OTM not provided";
		return;
	}

	const init = {
		method: "POST",
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify(inputValues)
	};

	try {

		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/verify_otp', init);

		if (!response.ok || response.status == 500) {
			document.getElementById("form__login--errorMsg").textContent = "Erreur " + response.status;
			document.getElementById("form__login--errorMsg").classList.add("text-danger");
			document.getElementById("form__login--errorMsg").classList.remove("text-success");
		}

		if (!response.ok || response.status === 203) {
			let errorMsg = await response.text();
			errorMsg = JSON.parse(errorMsg);
			console.log(errorMsg);
			if (Object.keys(errorMsg) == "non_field_errors" && Object.values(errorMsg) == "Invalid credentials")
				document.getElementById("form__login--errorMsg").textContent = "Incorrect Credentials";
			else if (response.status == 422)
				document.getElementById("form__login--errorMsg").textContent = errorMsg;
			else if (response.status == 401)
				document.getElementById("form__login--errorMsg").textContent = errorMsg["error"];
			else {
				if (Object.keys(errorMsg) == "error")
					document.getElementById("form__login--errorMsg").textContent = errorMsg["error"];
				else
					document.getElementById("form__login--errorMsg").textContent = "error";
			}
			return;
		}
		if (response.status === 200) {

			const data = await response.json();

			sessionStorage.setItem("username", data["username"]);
			sessionStorage.setItem("email", data["email"]);
			if (data["avatar"])
				sessionStorage.setItem("avatar", data["avatar"]);
			if (data["nickname"])
				sessionStorage.setItem("nickname", data["nickname"]);
			sessionStorage.setItem("access", data["access"]);
			sessionStorage.setItem("refresh", data["refresh"]);
			
			// // Manually call the hide function of the boostrap Modal element
			// var modal = bootstrap.Modal.getOrCreateInstance('#modal__login');
			// await modal.hide();

			document.getElementById("login").textContent = "Logout";
			document.getElementById("login").value = "logout";
			document.querySelectorAll(".log__item").forEach(btn => {
				btn.disabled = false;
			});
			router("index");
		}
	} catch (e) {
		console.error("Error connect user: ", e);
	}
};

async function connectUser(loginForm) {

	// remove a potential error message from the field
	// TODO dans le login(normal) on a le login et le mdp qui apparaissent dans la request, je met ca la comme ca on oublie pas...
	//
	document.getElementById("form__login--errorMsg").textContent = "";

	const input = loginForm.elements;

	const inputValues = {
		username: input.username.value,
		password: input.password.value,
	};

	if (!inputValues.username) {
		document.getElementById("form__login--errorMsg").textContent = "Username not provided";
		return;
	}
	if (!inputValues.password) {
		document.getElementById("form__login--errorMsg").textContent = "Password not provided";
		return;
	}

	const init = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(inputValues)
	};

	try {

		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/login', init);

		if (!response.ok || response.status == 500) {
			document.getElementById("form__login--errorMsg").textContent = "Erreur " + response.status;
			document.getElementById("form__login--errorMsg").classList.add("text-danger");
			document.getElementById("form__login--errorMsg").classList.remove("text-success");
		}

		if (!response.ok || response.status === 203) {
			let errorMsg = await response.text();
			errorMsg = JSON.parse(errorMsg);
			console.log(errorMsg);
			if (Object.keys(errorMsg) == "non_field_errors" && Object.values(errorMsg) == "Invalid credentials")
				document.getElementById("form__login--errorMsg").textContent = "Incorrect Credentials";
			else if (response.status == 422)
				document.getElementById("form__login--errorMsg").textContent = errorMsg;
			else if (response.status == 401)
				document.getElementById("form__login--errorMsg").textContent = errorMsg["error"];
			else {
				if (Object.keys(errorMsg) == "error")
					document.getElementById("form__login--errorMsg").textContent = errorMsg["error"];
				else
					document.getElementById("form__login--errorMsg").textContent = "error";
			}
			return;
		}
		if (response.status === 202) {
			document.getElementById("otp").classList.remove("d-none");
			document.getElementById("otp").classList.add("d-block");
			document.getElementById("form__login--btn").classList.add("d-none");
			document.getElementById("form__login--btn").disabled = true;
			document.getElementById("btn__createAccount").disabled = true;
			document.getElementById("form__loginOTP--btn").classList.remove("d-none");

			const data = await response.json();

			sessionStorage.setItem("id", data["id"]);

			document.getElementById("form__loginOTP--btn").addEventListener("click", (e) => {
				e.preventDefault();
				verifyOTP(loginForm);
			});
		}
	} catch (e) {
		console.error("Error connect user: ", e);
	}
};

async function createUser(createAccountForm) {

	// remove a potential error message from the field
	document.getElementById("form__createAccount--msg").textContent = "";
	document.getElementById("form__input--usernameError").textContent = "";
	document.getElementById("form__input--emailError").textContent = "";
	document.getElementById("form__input--passwordError").textContent = "";

	const input = createAccountForm.elements;

	const usernameRegex = /^[a-zA-Z0-9@./+\-_]{1,150}$/g;
	if (!input.username.value.match(usernameRegex)){
		document.getElementById("form__createAccount--msg").textContent = "Invalid username";
		document.getElementById("form__createAccount--msg").classList.add("text-danger");
		return;
	}
	if (!input.username.value.match(usernameRegex)){
		document.getElementById("form__createAccount--msg").textContent = "Invalid username";
		document.getElementById("form__createAccount--msg").classList.add("text-danger");
		return;
	}
	if (input.username.value.includes("_42")){
		document.getElementById("form__createAccount--msg").textContent = "_42 is not allowed in Username";
		document.getElementById("form__createAccount--msg").classList.add("text-danger");
		return;
	}

	if (!input.email.value) {
		document.getElementById("form__createAccount--msg").textContent = "Invalid email";
		document.getElementById("form__createAccount--msg").classList.add("text-danger");
		return;
	}

	if (input["password_one"].value !== input["password_two"].value || !input.password_one.value) {
		document.getElementById("form__createAccount--msg").textContent = "Password not confirmed";
		document.getElementById("form__createAccount--msg").classList.add("text-danger");
		document.getElementById("form__createAccount--msg").classList.remove("text-success");
		return;
	}

	const inputValues = {
		username: input.username.value,
		password: input.password_one.value,
		email: input.email.value,
	};

	const init = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(inputValues)
	};

	try {
		let hostnameport = "https://" + window.location.host;

		const response = await fetch(hostnameport + '/api/players/create', init);

		if (response.status == 500) {
			document.getElementById("form__createAccount--msg").textContent = "Erreur " + response.status;
			document.getElementById("form__createAccount--msg").classList.add("text-danger");
			document.getElementById("form__createAccount--msg").classList.remove("text-success");
		}
		else if (response.status == 400) {
			const errorMsg = await response.json();
			document.getElementById("form__createAccount--msg").textContent = "Error"

			if (errorMsg["username"])
				document.getElementById("form__input--usernameError").textContent = errorMsg["username"][0];
			if (errorMsg["email"])
				document.getElementById("form__input--emailError").textContent = errorMsg["email"][0];
			if (errorMsg["password"])
				document.getElementById("form__input--emailError").textContent = errorMsg["password"][0];

			document.getElementById("form__createAccount--msg").classList.add("text-danger");
			document.getElementById("form__createAccount--msg").classList.remove("text-success");
		}
		else if (response.status === 201) {
			document.getElementById("form__createAccount--msg").textContent = "User created. Please Log in";
			document.getElementById("form__createAccount--msg").classList.remove("text-danger");
			document.getElementById("form__createAccount--msg").classList.add("text-success");
		}
	} catch (e) {
		console.error("Error create user: ", e);
	}
};

// TODO lzit : a quoi sert cette fonction, pourquoi aucune verification de status d'erreur? voir les autres appels API pour faire pareil si possible
async function connectUser42() {

	try {
		let hostnameport = "https://" + window.location.host;
		
		const response = await fetch(hostnameport + '/api/players/fetch_authpage/')
		
		const authUrl = await response.json();

		window.location.href = (authUrl);
	} catch (e) {
		console.error("Error ro page 42Auth : ", e);
	}
};

function listenerLogin() {

	const login42Btn = document.querySelector("#btn__login--42");

	const loginForm = document.querySelector("#form__login");
	const createAccountForm = document.querySelector("#form__createAccount");

	// Reset all fields (input and error) from the form when the modal pass to hidden
	document.getElementById("modal__login").addEventListener("hidden.bs.modal", e => {
		e.preventDefault();

		loginForm.querySelectorAll(".input__field").forEach(inputElement => {
			inputElement.value = "";

			// Check the existence of the element since trigger by the hide() when the connect is successful
			if (inputElement.parentElement.querySelector(".form__input--errorMsg"))
				inputElement.parentElement.querySelector(".form__input--errorMsg").textContent = "";
			if (document.getElementById("form__login--errorMsg"))
				document.getElementById("form__login--errorMsg").textContent = "";
		});
	});

	// Reset all fields (input and error) from the form when the modal pass to hidden
	document.getElementById("modal__createAccount").addEventListener("hidden.bs.modal", e => {
		e.preventDefault();

		createAccountForm.querySelectorAll(".input__field").forEach(inputElement => {
			inputElement.value = "";
			// inputElement.parentElement.querySelector(".form__input--errorMsg").textContent = "";
			document.getElementById("form__input--usernameError").textContent = "";
			document.getElementById("form__input--emailError").textContent = "";
			document.getElementById("form__input--passwordError").textContent = "";
			document.getElementById("form__createAccount--msg").textContent = "";
		});
	});

	// Login via "normal" account handler
	loginForm.addEventListener("submit", e => {
		e.preventDefault();
		connectUser(loginForm);
	});

	// Create account handler
	createAccountForm.addEventListener("submit", e => {
		e.preventDefault();
		createUser(createAccountForm);
	});

	// Login with 42 handler
	login42Btn.addEventListener("click", e => {
		e.preventDefault();
		connectUser42();
	});
	
};

export default {
	listenerLogin,
};
