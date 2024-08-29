export default function renderPongOnline() {
	return `
		<div class="row">
		<div class="text-center py-5">
				<h1>Pong Online with Friends</h1>
		</div>
		</div>
		<div class="row">
			<div id="add_friend">
				<div class="list-group d-flex align-items-start ps-5">
						<button class="btn btn-outline-secondary text-light" type="button" data-bs-toggle="modal" data-bs-target="#modal__add_friend" id="btn__add_friend">Add Friend
				</div>
			</div>
			<div class="modal fade" id="modal__add_friend" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered text-center">
					<div class="modal-content">
						<div class="modal-header text-dark fw-bold fs-2">
							<p class="col-11 modal-title"></p>
							<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
						</div>
						<div class="modal-body">
							<form id="form__add_friend" class="">
							<div class="mb-1" id="form__add_friend--msg"></div>
								<div class="mb-2">
									<div class="text-dark">
										Nickname
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="add_friend_nickname">
									<div id="form__tournament--msg" class="text-danger"></div>
								</div>
								<button class="btn btn-dark mt-1" type="submit">
									Add
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row my-3 align-items-center text-center"">
			<div class="col">
				Friend 1:
				<div id="friend1__nickname--big" class="fw-bold"></div>
			</div>
			<div class="col">
				<button class="btn btn-outline-secondary text-light" id="btn__accept_friend__nickname">
					Accept
				</button>
			</div>
			<div class="col">
				<button class="btn btn-outline-secondary text-light" id="btn__play_friend__nickname">
					Play
				</button>
			</div>
		</div>
				<div class="row my-3 align-items-center text-center"">
			<div class="col">
				Friend 2:
				<div id="friend2__nickname--big" class="fw-bold"></div>
			</div>
			<div class="col">
				<button class="btn btn-outline-secondary text-light" id="btn__accept_friend__nickname">
					Accept
				</button>
			</div>
			<div class="col">
				<button class="btn btn-outline-secondary text-light" id="btn__play_friend__nickname">
					Play
				</button>
			</div>
		</div>
				<div class="row my-3 align-items-center text-center"">
			<div class="col">
				Friend 3:
				<div id="friend3__nickname--big" class="fw-bold"></div>
			</div>
			<div class="col">
				<button class="btn btn-outline-secondary text-light" id="btn__accept_friend__nickname">
					Accept
				</button>
			</div>
			<div class="col">
				<button class="btn btn-outline-secondary text-light" id="btn__play_friend__nickname">
					Play
				</button>
			</div>
		</div>
		<div class="row text-center py-4">
			<div id="tournament">
				<div class="list-group d-flex align-items-center">
					<div class="row my-4"></div>
					<div class="row my-2">
						<button class="btn btn-outline-secondary text-light" type="button" data-bs-toggle="modal" data-bs-target="#modal__tournament" id="btn__tournament">Tournament
					</div>
					<div class="row my-5"></div>
				</div>
			</div>
			<div class="modal fade" id="modal__tournament" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered text-center">
					<div class="modal-content">
						<div class="modal-header text-dark fw-bold fs-2">
							<p class="col-11 modal-title"></p>
							<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
						</div>
						<div class="modal-body">
							<form id="form__tournament" class="">
							<div class="mb-1" id="form__tournament--msg"></div>
								<div class="mb-2">
									<div class="text-dark">
										Player 1
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="player1">
									<div id="form__tournament--msg" class="text-danger"></div>
								</div>
								<div class="mb-2">
									<div class="text-success-emphasis">
										Player 2
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="player2">
								</div>
								<div class="mb-2">
									<div class="text-success-emphasis">
										Player 3
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="player3">
								</div>
								<div class="mb-2">
									<div class="text-success-emphasis">
										Player 4
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="player4">
								</div>
								<button class="btn btn-dark mt-1" type="submit">
									Start
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col d-flex justify-content-center align-items-center">
				<div class="position-absolute">
					<div id="config-menu" class="nav-item dropdow">
					<div id="question-container" class="nav-link dropdown-toggle question" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></div>
					<ul id="options-container" class="options dropdown-menu bg-dark border-dark"></ul>
      				</div>
				</div>
				<div id="countdownDisplay" class="position-absolute h1">
				</div>
				<div id="board_two">
				</div>
			</div>
		</div>

	`;
}
