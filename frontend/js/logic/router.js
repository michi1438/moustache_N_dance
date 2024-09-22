// Importe la View de chaque page
import renderPongLocal from "../views/viewPongLocal.js"
import renderPongOnline from "../views/viewPongOnline.js"
import renderLogin from "../views/viewLogin.js"
import render404_error from "../views/view404_error.js"
import renderUserInfo from "../views/viewUserInfo.js"
import renderPongTournament from "../views/viewPongTournament.js"
import { unloadScript } from "./ponglocallogic.js"

// Importe le script de chaque page qui gere le load et listener
import handlePongLocal from "./ponglocallogic.js"
import handlePongOnline from "./unloadpongonline.js"
import handleLogin from "./login.js"
import handleLogin42 from "./login42.js"
import handleUserInfo from "./userinfo.js"
<<<<<<< HEAD
//import handlePongOnline from "../game/pongonline.js"
import handlePongTournament from "./unloadpongtournament.js"
// Cas particulier pour index
=======
import handlePongOnline from "../game/pongonline.js"
import handlePongTournament from "../game/pongtournament.js"
>>>>>>> origin/BlerimSidewMergedBack
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
		listener: handlePongOnline.listenerPongOnline
	},
	"pongtournament": {
		title: "Pong Tournament",
		path: "/pongtournament/",
		view: renderPongTournament,
		listener: handlePongTournament.listenerPongTournament
	},
	"404_error": {
		title: "404 error",
		path: "/404_error/",
		view: render404_error,
	},
	"userinfo": {
		title: "User Info",
		path: "/userinfo/",
		view: renderUserInfo,
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
		}

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
				found = true
				document.getElementById('main__content').innerHTML = routes[route].view();  // Render the HTML content for the page

				if (sessionStorage.getItem("username")){
					document.getElementById("login").textContent = "Logout";
					document.getElementById("login").value = "logout";
					document.querySelectorAll(".log__item").forEach(btn => {
						btn.disabled = false;
					});
				}

				document.title = routes[route].title;
				routes[route].listener();  // Attach event listener
			// }
		}
	}

	if (found === false)
	{
		router("404_error")
	}
};

// Fonction pour décoder un JWT (partie payload)
function parseJwt(token) {
    const base64Url = token.split('.')[1];  // Récupère la partie payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Fonction pour rafraîchir le token
async function refreshToken() {
    
	const access = sessionStorage.getItem("access");
		const inputValues = {
			refresh: sessionStorage.getItem("refresh"),
		};

		const init = {
			method: "POST",
			headers: { 'Authorization': `Bearer ${access}`, 'Content-Type': 'application/json'},
			body: JSON.stringify(inputValues,),
		}

		try {

			let hostnameport = "https://" + window.location.host

			const response = await fetch(hostnameport + '/api/players/token_refresh', init);

			if (response.status === 200) {
				const data = await response.json();

				sessionStorage.setItem("access", data["access"]);
				sessionStorage.setItem("refresh", data["refresh"]);
				return data["access"];
			}
		} catch (e) {
			console.error(e);
		}
}

// Surveiller et rafraîchir automatiquement le token
export async function monitorTokenExpiration() {
    const accessToken = sessionStorage.getItem('access');
    if (accessToken) {
        const decodedToken = parseJwt(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiration = decodedToken.exp - currentTime;
		console.log(timeUntilExpiration);	

        // Déclenche le rafraîchissement 1 minutes avant l'expiration
        const refreshThreshold = 60; // 1 minutes

        if (timeUntilExpiration < refreshThreshold) {
            const newaccessToken = await refreshToken();
			return newaccessToken;
        } else {
            // Planifier un rafraîchissement 1 minutes avant l'expiration
            setTimeout(refreshToken, (timeUntilExpiration - refreshThreshold) * 1000);
			return accessToken;
        }
    }
}


/**
 * Logout handler function
 * Send a PATCH request to the server to logout the user
 * If the response status is 200, the user is successfully logged out and redirected to the login page
*/
async function handleLogout() {

	if (document.getElementById("login").value == "logout"){
		document.getElementById("login").textContent = "Login";
		document.getElementById("login").value = "login";
		
		const access = await monitorTokenExpiration();
		const inputValues = {
			refresh: sessionStorage.getItem("refresh"),
			access: access,
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
				document.querySelectorAll(".log__item").forEach(btn => {
					btn.disabled = true;
				});
				
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

	document.getElementById("login").addEventListener("click", (e) => {
		e.preventDefault();
		handleLogout();
	});

	document.querySelectorAll(".nav__item").forEach(element => {
		element.addEventListener("click", (e) => {
			e.preventDefault();

			if (element.value !== window.location.pathname.replaceAll("/", "")) {
				router(element.value);
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
});

export { router }
