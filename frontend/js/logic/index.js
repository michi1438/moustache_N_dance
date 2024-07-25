function renderIndex() {
	return `
			<div class="text-center py-5">
				<h1>Welcome</h1>
			</div>

	`;
};

function listenerIndex() {

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
