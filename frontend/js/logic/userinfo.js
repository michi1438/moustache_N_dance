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
	
	const access = sessionStorage.getItem("access");

	const init = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: JSON.stringify({nickname: input.nickname.value}),
	};

	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/profile', init);

		if (response.status != 200) {

			const error = await response.text();
			

			
			msgElement.textContent = error.replace(/["{}[\]]/g, '');
			msgElement.classList.add("text-danger");
			return;
		}
		if (response.status === 200) {
			const data = await response.json();

			sessionStorage.setItem("nickname", data.nickname);

			msgElement.textContent = "Nickname changed";
			msgElement.classList.remove("text-danger");
			msgElement.classList.add("text-success");

			window.location.reload();
		}

	} catch (e) {
		console.error(e);
	}
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

	const access = sessionStorage.getItem("access");

	const init = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: JSON.stringify({username: input.username.value}),
	};

	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/profile', init);

		if (response.status != 200) {

			const error = await response.text();
			

			
			msgElement.textContent = error.replace(/["{}[\]]/g, '');
			msgElement.classList.add("text-danger");
			return;
		}
		if (response.status === 200) {
			const data = await response.json();

			sessionStorage.setItem("username", data.username);

			msgElement.textContent = "Username changed";
			msgElement.classList.remove("text-danger");
			msgElement.classList.add("text-success");

			window.location.reload();
		}

	} catch (e) {
		console.error(e);
	}
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

	const access = sessionStorage.getItem("access");

	const init = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: JSON.stringify({email: input.email.value}),
	};

	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/profile', init);

		if (response.status != 200) {

			const error = await response.text();
			

			
			msgElement.textContent = error.replace(/["{}[\]]/g, '');
			msgElement.classList.add("text-danger");
			return;
		}
		if (response.status === 200) {
			const data = await response.json();

			sessionStorage.setItem("email", data.email);

			msgElement.textContent = "Email changed";
			msgElement.classList.remove("text-danger");
			msgElement.classList.add("text-success");

			window.location.reload();
		}

	} catch (e) {
		console.error(e);
	}
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

	const access = sessionStorage.getItem("access");

	const init = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: JSON.stringify({password: input.password_one.value})
	};

	try {

		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/profile', init);

		if (response.status != 200) {
			const error = await response.text();
			console.log("undpate password", error)
			msgElement.textContent = error.replace(/["{}[\]]/g, '');
			msgElement.classList.add("text-danger");
			return;
		}
		if (response.status === 200) {
			const data = await response.json();

			msgElement.textContent = "Password changed";
			msgElement.classList.remove("text-danger");
			msgElement.classList.add("text-success");
		}
	} catch (e) {
		console.error(e);
	}
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
	
	const access = sessionStorage.getItem("access");

	const init = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: data,
	};

	try {

		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/profile', init);

		if (response.status === 400) {
			const error = await response.text();

			msgElement.textContent = error.replace(/["{}[\]]/g, '');
			msgElement.classList.add("text-danger");
			return;
		}
		if (response.status === 200) {
			const data = await response.json();

			sessionStorage.setItem("avatar", data.avatar);

			msgElement.textContent = "Avatar changed";
			msgElement.classList.remove("text-danger");
			msgElement.classList.add("text-success");

			window.location.reload();
		}
	} catch (e) {
		console.error(e);
	}
};

async function addFriend(friendForm) {

	const msgElement = document.getElementById("form__add_friend--msg");

	// remove a potential error message from the placeholder
	msgElement.textContent = "";
	msgElement.classList.remove("text-danger");
	msgElement.classList.remove("text-success");

	const input = friendForm.elements;

	if (!input.add_friend_nickname.value) {
		msgElement.textContent = "User not found";
		msgElement.classList.add("text-danger");
		return;
	}

	const access = sessionStorage.getItem("access");

	const init = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: JSON.stringify({to_player_id: input.add_friend_nickname.value}),
	};

	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/friends/request', init);

		if (response.status != 201) {

			const error = await response.text();
			

			
			msgElement.textContent = error.replace(/["{}[\]]/g, '');
			msgElement.classList.add("text-danger");
			return;
		}
		if (response.status === 201) {

			msgElement.textContent = "Friend request sent";
			msgElement.classList.remove("text-danger");
			msgElement.classList.add("text-success");

			// window.location.reload();
		}

	} catch (e) {
		console.error(e);
	}
};

async function loadFriend() {

	const access = sessionStorage.getItem("access");

	const init = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
	};

	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/friends/requests_received', init);

		if (response.status != 200) {

			const error = await response.text();

			return;
		}
		if (response.status === 200) {
			const data = await response.json();
			sessionStorage.setItem("friends_received", data.sender_ids);

			// window.location.reload();
		}
	} catch (e) {
		console.error(e);
	}
	
	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/friends/list', init);

		if (response.status != 200) {

			const error = await response.text();

			return;
		}
		if (response.status === 200) {
			const data = await response.json();
			if (data[0]) {
				sessionStorage.setItem("friend1_id", data[0].id);
				if (data[0].online === true)
					sessionStorage.setItem("friend1_status", "online");
				else
					sessionStorage.setItem("friend1_status", "offline");
			}
			else {
				sessionStorage.setItem("friend1_id", "");
				sessionStorage.setItem("friend1_status", "");
			}
			if (data[1]) {
				sessionStorage.setItem("friend2_id", data[1].id);
				if (data[1].online === true)
					sessionStorage.setItem("friend2_status", "online");
				else
					sessionStorage.setItem("friend2_status", "offline");
			}
			else {
				sessionStorage.setItem("friend2_id", "");
				sessionStorage.setItem("friend2_status", "");
			}

			// window.location.reload();
		}

	} catch (e) {
		console.error(e);
	}
};

async function acceptFriend(friend_id) {

	const access = sessionStorage.getItem("access");

	const init = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: JSON.stringify({requester_id: friend_id, action: "accept"}),
	};

	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/friends/response', init);

		if (response.status != 200) {

			const error = await response.text();

			return;
		}
		if (response.status === 200) {
			const data = await response.json();

			// window.location.reload();
		}

	} catch (e) {
		console.error(e);
	}
};

async function deleteFriend(friend_id) {

	const access = sessionStorage.getItem("access");

	const init = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
		body: JSON.stringify({friend_id: friend_id}),
	};

	try {
		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/players/friends/delete', init);

		if (response.status != 200) {

			const error = await response.text();

			return;
		}
		if (response.status === 200) {
			const data = await response.json();

			// window.location.reload();
		}

	} catch (e) {
		console.error(e);
	}
};

function listenerUserInfo() {

	if (sessionStorage.getItem("username"))
		loadFriend();

	document.getElementById("update__avatar--big").src = sessionStorage.getItem("avatar") !== null ?
		sessionStorage.getItem("avatar") : "/frontend/img/avatar.png";
	document.getElementById("update__username--big").textContent = sessionStorage.getItem("username");
	document.getElementById("update__nickname--big").textContent = sessionStorage.getItem("nickname");
	document.getElementById("update__email--big").textContent = sessionStorage.getItem("email");
	document.getElementById("friend1__nickname--big").textContent = sessionStorage.getItem("friend1_id");
	document.getElementById("friend1__status--big").textContent = sessionStorage.getItem("friend1_status");
	document.getElementById("friend2__nickname--big").textContent = sessionStorage.getItem("friend2_id");
	document.getElementById("friend2__status--big").textContent = sessionStorage.getItem("friend2_status");
	document.getElementById("friend3__nickname--big").textContent = sessionStorage.getItem("friends_received");

	const nicknameForm = document.getElementById("form__updateNickname");
	const usernameForm = document.getElementById("form__updateUsername");
	const passwordForm = document.getElementById("form__updatePassword");
	const avatarForm = document.getElementById("form__updateAvatar");
	const emailForm = document.getElementById("form__updateEmail");
	const friendForm = document.getElementById("form__add_friend");

	var xValues = ["Wins", "Losses"];
	var yValues = [70, 30];
	var barColors = [
	"#1e7145",
	"#fe8d63",
	];

	new Chart("StatChart", {
	type: "pie",
	data: {
		labels: xValues,
		datasets: [{
		backgroundColor: barColors,
		data: yValues
		}]
	},
	options: {
		title: {
		display: false,
		text: "Stat"
		}
	}
	});

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

	friendForm.addEventListener("submit", e => {
		e.preventDefault();

		addFriend(friendForm);
	});
	document.getElementById("btn__friend1_accept").addEventListener("click", (e) => {
		e.preventDefault();
		acceptFriend(document.getElementById("friend1__nickname--big").textContent);
		document.getElementById("btn__friend1_accept").classList.add("d-none");
		document.getElementById("btn__friend1_accept").disabled = true;
		document.getElementById("btn__friend1_delete").classList.remove("d-none");
	});
	document.getElementById("btn__friend1_delete").addEventListener("click", (e) => {
		e.preventDefault();
		deleteFriend(document.getElementById("friend1__nickname--big").textContent);
	});
	document.getElementById("btn__friend3_accept").addEventListener("click", (e) => {
		e.preventDefault();
		acceptFriend(document.getElementById("friend3__nickname--big").textContent);
		document.getElementById("btn__friend3_accept").classList.add("d-none");
		document.getElementById("btn__friend3_accept").disabled = true;
		document.getElementById("btn__friend3_delete").classList.remove("d-none");
	});
	document.getElementById("btn__friend3_delete").addEventListener("click", (e) => {
		e.preventDefault();
		deleteFriend(document.getElementById("friend3__nickname--big").textContent);
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
