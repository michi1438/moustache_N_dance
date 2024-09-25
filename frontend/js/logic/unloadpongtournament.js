import router from "./router.js"
import { monitorTokenExpiration } from "./router.js"

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

	const waitingDisplay = document.getElementById('waitingDisplay');
	waitingDisplay.style.display = 'none';

    scriptTournamentPong.type = 'module';
    scriptTournamentPong.src = '/frontend/js/game/pongtournament.js?' + new Date().getTime(); // Ajoute un horodatage à l'URL
    scriptTournamentPong.setAttribute('data-pong', 'dynamic');  // Marqueur pour identifier les scripts chargés dynamiquement
    document.body.appendChild(scriptTournamentPong);
	}

function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('fr-FR');  // jj/mm/aaaa
    const formattedTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });  // hh:mm
    return `${formattedDate} ${formattedTime}`;
}

async function fetchTournaments(){

	const access = await monitorTokenExpiration();

	const init = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${access}`,
		},
	};

	try {

		let hostnameport = "https://" + window.location.host

		const response = await fetch(hostnameport + '/api/tournaments/list', init);

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

	const reversedTournaments = tournaments.reverse();

	const listHTML = reversedTournaments.map(tournament =>{
		const isCompleted = tournament.status === 'completed';
		let resultHTML = '';

		if (isCompleted){
			resultHTML = `
				<div class="collapse" id="collapseResult${tournament.id}">
                    <ul class="list-group-flush mt-2">
                        ${tournament.results.slice().reverse().map((playerIdString, index) => {
							const playerId = parseInt(playerIdString, 10);
                            const participant = tournament.participants.find(p => p.id === playerId);
                            const nickname = participant ? participant.nickname : 'Joueur inconnu';
                            return `<li class="list-group-item bg-dark text-white">${index + 1}. ${nickname}</li>`;
                        }).join('')}
                    </ul>
                </div>
			`;
		}

		const toggleResult = isCompleted ? `
			<button class="btn btn-link text-white p-0 mt-1" data-bs-toggle="collapse" data-bs-target="#collapseResult${tournament.id}">
                <i class="bi bi-chevron-down ms-2"></i>
            </button>
			` : '';

		return `
			<li class="list-group-item bg-dark text-white">
				<strong>${formatDate(tournament.created_on)}</strong> : 
				Created by <strong>${tournament.created_by.nickname}</strong> - 
				Status <strong>${tournament.status}</strong>
				${toggleResult}
				${resultHTML}
			</li>
		`;
	}).join('');

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
