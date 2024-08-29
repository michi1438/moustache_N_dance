import router from "./router.js"

export function unloadScript() {
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

export function listenerPongLocal() {
	unloadScript()
    // Créer et ajouter le script localpong.js
    document.querySelectorAll('script[data-disabled="true"]').forEach(script => {
        script.setAttribute('type', 'module');
        script.removeAttribute('data-disabled');
    });
    const scriptLocalPong = document.createElement('script');
    scriptLocalPong.type = 'module';
    scriptLocalPong.src = '/frontend/js/game/oldmain.js'
    scriptLocalPong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptLocalPong);
}

export default {
	listenerPongLocal,
	unloadScript,
	// loadPongLocal
};