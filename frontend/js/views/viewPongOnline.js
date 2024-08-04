export default function renderPongOnline() {
	return `
		<div class="row">
		<div class="text-center py-5">
				<h1>Pong Online</h1>
		</div>
		</div>
		<div class="row">
			<div class="col d-flex justify-content-center align-items-center">
				<div class="position-absolute">
					<div id="config-menu" class="nav-item dropdow">
					<div id="question-container" class="nav-link dropdown-toggle question" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></div>
					<ul id="options-container" class="options dropdown-menu"></ul>
      				</div>
				</div>
				<div id="countdownDisplay" class="position-absolute h1">
				</div>
				<div id="board_two" class="text-bg-dark border border-black border-5">
				</div>
				
			</div>
			
		</div>

	`;
}
