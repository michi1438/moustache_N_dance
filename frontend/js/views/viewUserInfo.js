export default function renderUserInfo() {

	return `
		<div class="row">
			<div class="text-center py-5">
				<h1>User Profile</h1>
			</div>
		</div>
		<div class="row align-items-center">
			<div class="col-4 text-center">
				<div class="row-3">
					<img src="" alt="" id="update__avatar--big" width="100" height="100" class="rounded-circle"/>
				</div>
				<div class="row-3 my-1">
				</div>
				<div class="row-3">
					<button class="btn btn-outline-secondary text-light" data-bs-toggle="modal" data-bs-target="#modal__updateAvatar" id="btn__updateAvatar">
						Change
					</button>
				</div>
				<div class="modal fade" id="modal__updateAvatar" aria-hidden="true">
					<div class="modal-dialog modal-dialog-centered text-center">
						<div class="modal-content">
							<div class="modal-header text-dark fw-bold fs-2">
								<p class="col-10 modal-title"></p>
								<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
							</div>
							<div class="modal-body">
								<form id="form__updateAvatar">
									<div id="form__updateAvatar--msg" class=""></div>
									<input type="file" class="input__field text-dark border" id="form__updateAvatar--input" name="avatar">
									<br>
									<button class="btn btn-dark mt-1" type="submit" id="form__updateAvatar--btn">
										Change
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-8">
				<div class="row my-3 align-items-center"">
					<div class="col">
						Nickname:
						<div id="update__nickname--big" class="fw-bold"></div>
					</div>
					<div class="col">
						<button class="btn btn-outline-secondary text-light" data-bs-toggle="modal" data-bs-target="#modal__updateNickname" id="btn__updateNickname">
							Change
						</button>
					</div>
					<div class="modal fade" id="modal__updateNickname" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered text-center">
							<div class="modal-content">
								<div class="modal-header text-dark fw-bold fs-2">
									<p class="col-11 modal-title"></p>
									<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
								</div>
								<div class="modal-body">
									<form id="form__updateNickname" class="">
										<div class="mb-1" id="form__updateNickname--msg"></div>
										<div class="mb-2">
											<div class="text-dark"">
												Nickname
											</div>
											<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="nickname">
											<div id="form__input--nicknameError" class="h6 text-danger"></div>
										</div>
										<button class="btn btn-dark mt-1" type="submit">
											Change
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row my-3 align-items-center">
					<div class="col">
						Username:
						<div id="update__username--big" class="fw-bold"></div>
					</div>
					<div class="col">
						<button class="btn btn-outline-secondary text-light" data-bs-toggle="modal" data-bs-target="#modal__updateUsername" id="btn__updateName">
							Change
						</button>
					</div>
					<div class="modal fade" id="modal__updateUsername" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered text-center">
							<div class="modal-content">
								<div class="modal-header text-dark fw-bold fs-2">
									<p class="col-11 modal-title"></p>
									<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
								</div>
								<div class="modal-body">
									<form id="form__updateUsername" class="">
										<div class="mb-1" id="form__updateUsername--msg"></div>
										<div class="mb-2">
											<div class="text-dark"">
												Username
											</div>
											<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="username">
											<div id="form__input--usernameError" class="h6 text-danger"></div>
										</div>
										<button class="btn btn-dark mt-1" type="submit">
											Change
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row my-3 align-items-center">
					<div class="col">
						Email:
						<div id="update__email--big" class="fw-bold"></div>
					</div>
					<div class="col">
						<button class="btn btn-outline-secondary text-light" data-bs-toggle="modal" data-bs-target="#modal__updateEmail" id="btn__updateEmail">
							Change
						</button>
					<div class="modal fade" id="modal__updateEmail" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered text-center">
							<div class="modal-content">
								<div class="modal-header text-dark fw-bold fs-2">
									<p class="col-11 modal-title"></p>
									<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
								</div>
								<div class="modal-body">
									<form id="form__updateEmail" class="">
										<div class="mb-1" id="form__updateEmail--msg"></div>
										<div class="mb-2">
											<div class="text-dark"">
												Email
											</div>
											<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="email">
											<div id="form__input--emailError" class="h6 text-danger"></div>
										</div>
										<button class="btn btn-dark mt-1" type="submit">
											Change
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row text-center py-4">
			<div id="updateinfo">
			<div class="list-group d-flex align-items-center">
				<div class="row my-5"></div>
				<div class="row my-2">
					<button class="btn btn-outline-secondary text-light" type="button" data-bs-toggle="modal" data-bs-target="#modal__updatePassword" id="btn__updatePasswordt">Change Password
				</div>
				<div class="row my-4"></div>
			</div>
			<div class="modal fade" id="modal__updatePassword" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered text-center">
					<div class="modal-content">
						<div class="modal-header text-dark fw-bold fs-2">
							<p class="col-11 modal-title"></p>
							<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
						</div>
						<div class="modal-body">
							<form id="form__updatePassword" class="">
							<div class="mb-1" id="form__updatePassword--msg"></div>
								<div class="mb-2">
									<div class="text-dark">
										Password
									</div>
									<input type="password" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="password_one">
									<div id="form__update--password--msg" class="text-danger"></div>
								</div>
								<div class="mb-2">
									<div class="text-success-emphasis">
										Confirm Password
									</div>
									<input type="password" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="password_two">
								</div>
								<button class="btn btn-dark mt-1" type="submit">
									Change
								</button>
							</form>
						</div>
					</div>
				</div>
		</div>
	`;
};