// Importe la View de chaque page
import renderTwoPlayers from "../views/viewTwoPlayers.js"


// Importe le script de chaque page qui gere le load et listener
//import handleXX from "./XX.js"

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
		title: "Main",
		path: "/",
		view: handleIndex.renderIndex,
		// load: handleIndex.loadIndex,
		// listener: handleIndex.listenerIndex
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
	document.getElementById("main__content").innerHTML = page.view();
	if (!page)
		return;

	// if (await page.load() === 1) {
	// 	document.getElementById("main__content").innerHTML = page.view();

	// 	// document.getElementById("topbar__profile--username").textContent =
	// 	// 	sessionStorage.getItem("username") ? sessionStorage.getItem("username") : "user";
	// 	// document.getElementById("topbar__profile--avatar").src =
	// 	// 	sessionStorage.getItem("avatar") ? sessionStorage.getItem("avatar") : "/frontend/img/person-circle-Bootstrap.svg";
	// 	// document.getElementById("topbar__profile--avatar").alt =
	// 	// 	sessionStorage.getItem("avatar") ? sessionStorage.getItem("username") + " avatar" : "temp avatar";

	// 	document.title = page.title;

	// 	window.history.pushState({}, "", page.path);

	// 	page.listener();
	// }
	else {
		console.log("page.load(): Error, redirect to login page");
		// router("login");
	}
};

/**
 * Event listener for DOMContentLoaded event
 * If the user is on the index page, index specific logic is executed
 * Attach event listener to the 'logout' button
 * Attach event listeners on all buttons with the class 'dropdown-item' i.e. all buttons that redirect to another "page"
*/
document.addEventListener("DOMContentLoaded", () => {

	// if (window.location.search.split("=")[0] == "?code") {
	// 	let code = window.location.search.split("=")[1];
	// 	load42Profile(code);
	// }

	if (window.location.pathname === "/") {
		loadIndex();
	}

	// document.getElementById("topbar__logout").addEventListener("click", (e) => {
	// 	e.preventDefault();
	// 	handleLogout();
	// });

	document.querySelectorAll(".nav__item").forEach(element => {
		element.addEventListener("click", (e) => {
			e.preventDefault();

			if (element.value !== window.location.pathname.replaceAll("/", "")) {
				router(element.value);
			}
		})
	});
});

export { router }
