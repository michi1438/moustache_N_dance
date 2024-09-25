export default function renderPongOnline() {
	return `
		<div class="row">
			<div class="text-center py-5">
				<h1>Pong Online</h1>
			</div>
		</div>
		<div class="row">
			<div class="col d-flex justify-content-center align-items-center flex-column">

				<div id="config-menu" class="nav-item dropdown mb-4">
					<div id="question-container" class="nav-link dropdown-toggle question" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></div>
					<ul id="options-container" class="options dropdown-menu bg-dark border-dark"></ul>
				</div>

				<div id="countdownDisplay" class="position-absolute h1"></div>
				<div id="waitingDisplay" class="position-absolute h2">En attente de votre adversaire...</div>

				<div id="board_three" class="text-bg-dark"></div>

			</div>
		</div>
	`;
}
