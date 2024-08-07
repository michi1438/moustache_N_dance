function renderIndex() {
	return `
			
			<div class="row pt-5">
				<div class="col d-flex justify-content-center align-items-center">
					<img src="/frontend/img/welcome.gif" id ="welcomeimg" alt="welcome" width="150" height="150"/>
				</div>
			</div>
			<div class="row">
				<div id=welcometxt class="text-center h1" >Welcome</div>
			</div>

	`;
};

function listenerIndex() {

	document.getElementById("welcometxt").textContent = "Welcome " + sessionStorage.getItem("username"); //TO DELETE !

};

// async function loadIndex()
// {
// 	try {
// 		let hostnameport = "https://" + window.location.host;

// 		const response = await fetch(hostnameport + '/api/index/');

// 		if (response.status === 202) {

// 			const data = await response.json();

// 			sessionStorage.setItem("username", data["username"]);
// 			sessionStorage.setItem("avatar", data["player"].avatar);
// 			sessionStorage.setItem("nickname", data["player"].nickname);

// 			// connect_socket_friend();

// 			return 1;
// 		}
// 		return 0;
// 	} catch (e) {
// 		console.error(e);
// 	}
// };

export default {
	renderIndex,
	listenerIndex,
	// loadIndex
};
