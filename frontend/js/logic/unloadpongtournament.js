import router from "./router.js"

export function unloadScript() {
	console.log("PongTournament script unloaded");
    // Désactiver les scripts chargés dynamiquement
    document.querySelectorAll('script[type="module"][data-pong="dynamic"]').forEach(script => {
        script.setAttribute('data-disabled', 'true');
        script.removeAttribute('type');
        if (window.gameSocket) {
            window.gameSocket.close();
            // console.log(window.gameSocket.readyState);
        }
        if (window.tournamentSocket) {
            window.tournamentSocket.close();
            // console.log(window.tournamentSocket.readyState);
        }
        // console.log(script);
        script.remove(); // Supprimer le script du DOM
    });
}

function loadPongTournament() {
	// Créer et ajouter le script Tournamentpong.js
	document.querySelectorAll('script[data-disabled="true"]').forEach(script => {
        script.setAttribute('type', 'module');
        script.removeAttribute('data-disabled');
    });
    const scriptTournamentPong = document.createElement('script');
    scriptTournamentPong.type = 'module';
    scriptTournamentPong.src = '/frontend/js/game/pongtournament.js?' + new Date().getTime(); // Ajoute un horodatage à l'URL
    scriptTournamentPong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptTournamentPong);
	}

export function listenerPongTournament() {

	if (sessionStorage.getItem("gameOverT") != "true") 
		loadPongTournament();

	if (sessionStorage.getItem("gameOverT") == "true"){
		unloadScript();
		sessionStorage.setItem("gameOverT", "");
		loadPongTournament();
	}
}

export default {
	listenerPongTournament,
	// loadPongTournament
};