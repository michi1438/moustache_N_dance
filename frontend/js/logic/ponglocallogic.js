
export function unloadScript() {
    // Désactiver les scripts chargés dynamiquement
    document.querySelectorAll('script[type="module"][data-pong="dynamic"]').forEach(script => {
        script.setAttribute('data-disabled', 'true');
        script.removeAttribute('type');
        if (window.ws && window.ws.readyState === WebSocket.OPEN) {
            window.ws.send(JSON.stringify({ type: 'left' }));
            window.ws.close();
            window.ws = null;
        }
        if (window.gameSocket) {
            window.gameSocket.close();
        }
        if (window.tournamentSocket) {
            window.tournamentSocket.close();
        }
        script.remove(); // Supprimer le script du DOM
    });
}

function loadPongLocal() {
	// Créer et ajouter le script localpong.js
	document.querySelectorAll('script[data-disabled="true"]').forEach(script => {
        script.setAttribute('type', 'module');
        script.removeAttribute('data-disabled');
    });
    const scriptLocalPong = document.createElement('script');
    scriptLocalPong.type = 'module';
    scriptLocalPong.src = '/frontend/js/game/ponglocal.js?' + new Date().getTime(); // Ajoute un horodatage à l'URL
    scriptLocalPong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptLocalPong);
	}

export function listenerPongLocal() {
	if (sessionStorage.getItem("gameOver") != "true") 
		loadPongLocal();

	if (sessionStorage.getItem("gameOver") == "true"){
		unloadScript();
		sessionStorage.setItem("gameOver", "");
		loadPongLocal();
	}
}

export default {
	listenerPongLocal,
};