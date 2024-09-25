// Importe la View de chaque page
import renderPongLocal from "../views/viewPongLocal.js"
import renderPongOnline from "../views/viewPongOnline.js"
import renderLogin from "../views/viewLogin.js"
import render404_error from "../views/view404_error.js"
import renderStats from "../views/viewStats.js" //TODO Are we keeping the Stats page ??
import renderUserInfo from "../views/viewUserInfo.js"
import renderPongTournament from "../views/viewPongTournament.js"
import { unloadScript } from "./ponglocallogic.js"


// Importe le script de chaque page qui gere le load et listener
//import handleXX from "./XX.js"
import handlePongLocal from "./ponglocallogic.js"
import handlePongOnline from "./unloadpongonline.js"
import handleLogin from "./login.js"
import handleLogin42 from "./login42.js"
import handleUserInfo from "./userinfo.js"
//import handlePongOnline from "../game/pongonline.js"
import handlePongTournament from "./unloadpongtournament.js"
// Cas particulier pour index
import handleIndex from "./index.js"

/**
 * Routes object
 * Contains all the pages of the website
 * Each page has a title, a path, a view, a load function and a listener function
 * The title is the title of the page
 * The path is the path of the page
 * The view is the HTML content of the page
 * The load function is the function that checks if the user can access the page
 * The listener function is the function that attaches event listeners to the page
*/
const routes = {
	"index": {
		title: "Moustache & Dance",
		path: "/",
		view: handleIndex.renderIndex,
		// load: handleIndex.loadIndex,
		listener: handleIndex.listenerIndex
	},
	"callback42": {
		title: "Callback42",
		path: "/callback/",
		view: handleIndex.renderIndex,
		// load: handleLogin.loadLogin,
		listener: handleLogin42.listenerCallback42
	},
	"login": {
		title: "Login",
		path: "/login/",
		view: renderLogin,
		// load: handleLogin.loadLogin,
		listener: handleLogin.listenerLogin
	},
	"ponglocal": {
		title: "Pong Local",
		path: "/ponglocal/",
		view: renderPongLocal,
		// load: handlePongLocal.loadPongLocal,
		listener: handlePongLocal.listenerPongLocal
	},
	"pongonline": {
		title: "Pong Online",
		path: "/pongonline/",
		view: renderPongOnline,
		// load: handlePongOnline.loadPongOnline,
		listener: handlePongOnline.listenerPongOnline
	},
	"pongtournament": {
		title: "Pong Tournament",
		path: "/pongtournament/",
		view: renderPongTournament,
		// load: handlePongTournament.loadPongTournament,
		listener: handlePongTournament.listenerPongTournament
	},
	"404_error": {
		title: "404 error",
		path: "/404_error/",
		view: render404_error,
		// load: handle404_error.load404_error,
		// listener: handle404_error.listener404_error
	},
	"stats": {
		title: "Stats",
		path: "/stats/",
		view: renderStats,
		// load: handleStats.loadStats,
		// listener: handleStats.listenerStats
	},
	"userinfo": {
		title: "User Info",
		path: "/userinfo/",
		view: renderUserInfo,
		// load: handleUserInfo.loadUserInfo,
		listener: handleUserInfo.listenerUserInfo
	},

};

/**
 * Router function
 * @param {string} value - The value of the button that was clicked
 * Get the page from the routes object, if it exists
 * Call the load function of the page
 * If the load function returns 1 (the user can access it), render the view of the page
*/
export default async function router(value) {
	unloadScript();

	var page = routes[value];
	
	if (page)
		{
			document.getElementById("main__content").innerHTML = page.view()
			window.history.pushState({}, "", page.path);
			document.title = page.title;
			page.listener();
			// console.log(window.location.pathname);
		}


	// if (await page.load() === 1) {
	// 	document.getElementById("main__content").innerHTML = page.view();

	// 	document.getElementById("topbar__profile--username").textContent =
	// 		sessionStorage.getItem("username") ? sessionStorage.getItem("username") : "user";
	// 	document.getElementById("topbar__profile--avatar").src =
	// 		sessionStorage.getItem("avatar") ? sessionStorage.getItem("avatar") : "/frontend/img/person-circle-Bootstrap.svg";
	// 	document.getElementById("topbar__profile--avatar").alt =
	// 		sessionStorage.getItem("avatar") ? sessionStorage.getItem("username") + " avatar" : "temp avatar";

	// 	document.title = page.title;

	// 	window.history.pushState({}, "", page.path);

	// 	page.listener();
	// }
	else {
		console.log("Error Page not found");
		router("404_error");
	}
};

/**
 * Event listener for window.onload event
 * Load the page that the user is currently on
 * If the user is logged in, load the page that the user is currently on
 * If the user is not logged in, redirect to the login page
*/
window.onload = async function()
{
	const currentPath = window.location.pathname;
	var found = false

	for (const route in routes)
	{
		if (routes[route].path === currentPath)
		{
			// if (await routes[route].load() === 1)
			// {

				found = true
				document.getElementById('main__content').innerHTML = routes[route].view();  // Render the HTML content for the page

				// document.getElementById("topbar__profile--username").textContent =
				// 	sessionStorage.getItem("username") ? sessionStorage.getItem("username") : "user";
				// document.getElementById("topbar__profile--avatar").src =
				// 	sessionStorage.getItem("avatar") ? sessionStorage.getItem("avatar") : "/frontend/img/person-circle-Bootstrap.svg";
				// document.getElementById("topbar__profile--avatar").alt =
				// 	sessionStorage.getItem("avatar") ? sessionStorage.getItem("username") + " avatar" : "temp avatar";
				if (sessionStorage.getItem("username")){
					document.getElementById("login").textContent = "Logout";
					document.getElementById("login").value = "logout";
				}
				
				document.title = routes[route].title;
				routes[route].listener();  // Attach event listener
			// }
		}
		// else
		// 	router("login");
		// return;
		
	}
	if (found === false)
	{
		router("404_error")
	}
};

/**
 * Logout handler function
 * Send a PATCH request to the server to logout the user
 * If the response status is 200, the user is successfully logged out and redirected to the login page
*/
async function handleLogout() {

	if (document.getElementById("login").value == "logout"){
		document.getElementById("login").textContent = "Login";
		document.getElementById("login").value = "login";

		const inputValues = {
			refresh: sessionStorage.getItem("refresh"),
			access: sessionStorage.getItem("access"),
		};

		const init = {
			method: "POST",
			headers: { 'Authorization': `Bearer ${inputValues.access}`, 'Content-Type': 'application/json'},
			body: JSON.stringify(inputValues)
		}

		try {

			let hostnameport = "https://" + window.location.host

			const response = await fetch(hostnameport + '/api/players/logout', init);

			if (response.status === 205) {
				sessionStorage.clear();
				router("login");
			}
		} catch (e) {
			console.error(e);
		}
	}
};

/**
 * Event listener for DOMContentLoaded event
 * If the user is on the index page, index specific logic is executed
 * Attach event listener to the 'logout' button
 * Attach event listeners on all buttons with the class 'nav__item' i.e. all buttons that redirect to another "page"
*/
document.addEventListener("DOMContentLoaded", () => {

	// if (window.location.search.split("=")[0] == "?code") {
	// 	let code = window.location.search.split("=")[1];
	// 	load42Profile(code);
	// }

	// if (window.location.pathname === "/") {
	// 	loadIndex();
	// }

	document.getElementById("login").addEventListener("click", (e) => {
		e.preventDefault();
		handleLogout();
	});

	document.querySelectorAll(".nav__item").forEach(element => {
		element.addEventListener("click", (e) => {
			e.preventDefault();

			if (element.value !== window.location.pathname.replaceAll("/", "")) {
				router(element.value);
				// console.log(window.location.pathname);
			}
		})
	});
});

/**
 * Event listener for popstate event
 * A popstate event is fired when the active history entry changes
*/
window.addEventListener("popstate", async (e) => {
	e.preventDefault();
	// console.log(window.location.pathname);
	// Get the current url, remove all '/' and if the url is null assign it to 'index'
	let url = window.location.pathname.replaceAll("/", "");
	if (url === "")
		url = "index";

	var page = routes[url];

	if (page)
	{
		document.getElementById("main__content").innerHTML = page.view();
		document.title = page.title;
		page.listener();
		return;
	}


	// if (await page.load() === 1) {
		// document.getElementById("main__content").innerHTML = page.view();

		// document.getElementById("topbar__profile--username").textContent =
		// 	sessionStorage.getItem("username") ? sessionStorage.getItem("username") : "user";
		// document.getElementById("topbar__profile--avatar").src =
		// 	sessionStorage.getItem("avatar") ? sessionStorage.getItem("avatar") : "/frontend/img/person-circle-Bootstrap.svg";
		// document.getElementById("topbar__profile--avatar").alt =
		// 	sessionStorage.getItem("avatar") ? sessionStorage.getItem("username") + " avatar" : "temp avatar";

		// document.title = page.title;

	// 	page.listener();
	// }
	// else
	// 	loadIndex();
});

export { router }
