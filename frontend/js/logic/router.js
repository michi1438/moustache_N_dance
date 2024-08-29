// Importe la View de chaque page
import renderPongLocal from "../views/viewPongLocal.js"
import renderPongOnline from "../views/viewPongOnline.js"
import renderLogin from "../views/viewLogin.js"
import renderLogout from "../views/viewLogout.js"
import renderGameHistory from "../views/ViewGameHistory.js"
import render404_error from "../views/view404_error.js"
import renderStats from "../views/viewStats.js"
import renderUserInfo from "../views/viewUserInfo.js"
import renderPongTournament from "../views/viewPongTournament.js"


// Importe le script de chaque page qui gere le load et listener
//import handleXX from "./XX.js"
import handlePongLocal from "../game/ponglocal.js"
import handleLogin from "./login.js"
import handleUserInfo from "./userinfo.js"
import handlePongOnline from "../game/pongonline.js"
import handlePongTournament from "../game/pongtournament.js"
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
	"login": {
		title: "Login",
		path: "/login/",
		view: renderLogin,
		// load: handleLogin.loadLogin,
		listener: handleLogin.listenerLogin
	},
	"logout": {
		title: "Logout",
		path: "/logout/",
		view: renderLogout,
		// load: handleLogout.loadLogout,
		// listener: handleLogout.listenerLogout
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
	"gamehistory": {
		title: "Game History",
		path: "/gamehistory/",
		view: renderGameHistory,
		// load: handleGameHistory.loadGameHistory,
		// listener: handleGameHistory.listenerGameHistory
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
	// router("index")
	const currentPath = window.location.pathname;
	// console.log(currentPath);
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

				document.title = routes[route].title;
				// routes[route].listener();  // Attach event listeners
			// }
			// else
			// 	router("login");
			return;
		}
	}
	if (found == false)
	{
		router("404_error")
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

	// document.getElementById("topbar__logout").addEventListener("click", (e) => {
	// 	e.preventDefault();
	// 	handleLogout();
	// });

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
