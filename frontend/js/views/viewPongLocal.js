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
					<button type="button" id="startGame2" class="btn btn-dark border-light">Commencer une partie</button>
				</div>
				<div id="canvas--text" class="position-absolute h2">
				</div>
				<div class="text-bg-dark border border-black border-5">
					<canvas id="board_two" width="650" height="480"></canvas>
				</div>
			</div>
			<div id="config-menu" style="display: block;">
				<div id="question-container" class="question">Mode de Jeu</div>
				<ul id="options-container" class="options"></ul>
      		</div>
		</div>
    	<div id="countdownDisplay"></div>

	`;
};
