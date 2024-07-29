export default function renderPongLocal() {

	return `

		<div class="text-center py-5">
				<h1>Pong Local</h1>
		</div>
		<div id="config-menu">
			<div id="question-container" class="question"></div>
			<ul id="options-container" class="options"></ul>
		</div>
		<div id="countdownDisplay"></div>
		<script type="module" src="/frontend/game/main.js"></script>
		<script type="module" src="/frontend/game/menu.js"></script>


	`;
};
