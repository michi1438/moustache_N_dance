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

async function fetchTournaments(){
	try {
		const token = sessionStorage.getItem('access');
		if (!token) {
			throw new Error('Token JWT manquant');
		}

		const response = await fetch('/api/tournaments/list',{
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Erreur: ${response.statusText}`);
		}

		const tournaments = await response.json();
		return tournaments;

	} catch (error) {
		console.error('Erreur lors du listing des tournois: ', error);
		return [];
	}
}

function renderTournamentList(tournaments){
	const tournamentListContainer = document.getElementById('tournament-list');

	if (tournaments.length === 0){
		tournamentListContainer.innerHTML = '<p>Aucun tournoi pour le moment.</p>';
		return;
	}

	const listHTML = tournaments.map(tournament => `
		<li class="list-group-item">
			Created by <strong>${tournament.created_by}</strong> - 
			Status <strong>${tournament.status}</strong>
		</li>
		`).join(' ');

	tournamentListContainer.innerHTML = `<ul class="list-group">${listHTML}</ul>`;
}

async function initializeTournamentPage(){
	const tournaments = await fetchTournaments();
	renderTournamentList(tournaments);
}

export function listenerPongTournament() {

	initializeTournamentPage();

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
