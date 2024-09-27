import router from "./router.js"

export function unloadScript() {
	console.log("PongOnline script unloaded");
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

function loadPongOnline() {
	// Créer et ajouter le script Onlinepong.js
	document.querySelectorAll('script[data-disabled="true"]').forEach(script => {
        script.setAttribute('type', 'module');
        script.removeAttribute('data-disabled');
    });
    const scriptOnlinePong = document.createElement('script');
	
	const waitingDisplay = document.getElementById('waitingDisplay');
	waitingDisplay.style.display = 'none';

    scriptOnlinePong.type = 'module';
    scriptOnlinePong.src = '/frontend/js/game/pongonline.js?' + new Date().getTime(); // Ajoute un horodatage à l'URL
    scriptOnlinePong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptOnlinePong);
	}

export function listenerPongOnline() {
	if (!sessionStorage.getItem("username")) {
		router("index");
		return;
	}

	if (sessionStorage.getItem("gameOverO") != "true") 
		loadPongOnline();

	if (sessionStorage.getItem("gameOverO") == "true"){
		unloadScript();
		sessionStorage.setItem("gameOverO", "");
		loadPongOnline();
	}
}

export default {
	listenerPongOnline,
	// loadPongOnline
};
