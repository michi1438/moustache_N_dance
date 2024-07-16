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
		//load: handleIndex.loadIndex,
		//listener: handleIndex.listenerIndex
	},
	"twoplayers": {
		title: "2 Joueurs Local",
		path: "/twoplayers/",
		view: renderTwoPlayers,
		// load: handleTwoPlayers.loadTwoPlayers,
		// listener: handleTwoPlayers.listenerTwoPlayers
	},
};
