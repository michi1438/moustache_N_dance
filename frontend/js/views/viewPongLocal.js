export default function renderPongLocal() {

	return `
		<div class="row">
		<div class="text-center py-5">
				<h1>Pong Local</h1>
		</div>
		</div>
		<div class="row">
			<div class="col d-flex justify-content-center align-items-center">
				<div class="position-absolute">
					<div id="config-menu" class="nav-item dropdown">
					<div id="question-container" class="nav-link dropdown-toggle question" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></div>
					<ul id="options-container" role="button" class="options dropdown-menu"></ul>
      				</div>
				</div>
				<div id="countdownDisplay" class="position-absolute h2">
				</div>
				<div class="text-bg-dark border border-black border-5">
					<canvas id="board_two" width="650" height="480"></canvas>
				</div>
			</div>
			
		</div>

	`;
};
