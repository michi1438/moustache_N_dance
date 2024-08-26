export default function renderLogin() {

	return `

		<div id="login">
			<div class="list-group d-flex align-items-center">
				<div class="row my-5"></div>
				<div class="row my-2">
					<button class="btn btn-lg btn-outline-secondary text-light" type="button" data-bs-toggle="modal" data-bs-target="#modal__login" id="btn__login">Login</button>
				</div>
				<div class="row my-4"></div>
				<div class="row my-2">
					<button class="btn btn-lg btn-outline-secondary text-light" id="btn__login--42">Login 
					<img src="/frontend/img/42_logo.svg" id ="image42" alt="42" width="25" height="25"/>
					</button>
				</div>
			</div>
			<div class="modal fade" id="modal__login" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered text-center">
					<div class="modal-content">
						<div class="modal-header text-dark fw-bold fs-2">
							<p class="col-11 modal-title"></p>
							<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
						</div>
						<div class="modal-body">
							<form id="form__login" class="">
								<div class="mb-1 text-danger" id="form__login--errorMsg"></div>
								<div class="mb-2">
									<div class="text-dark">
										Username
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="username">
									<div class="form__input--errorMsg text-danger"></div>
								</div>
								<div class="mb-2">
									<div class="text-dark ">
										Password
									</div>
									<input type="password" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="password">
									<div class="form__input--errorMsg text-danger"></div>
								</div>
								<button class="btn btn-dark mt-1" type="submit" id="form__login--btn">
									Login
								</button>
							</form>
						</div>
						<div class="modal-footer py-2">
							<button class="btn btn-outline-dark" type="button" data-bs-toggle="modal" data-bs-target="#modal__createAccount" id="btn__createAccount">Register</button>
						</div>
					</div>
				</div>
			</div>
			<div class="modal fade" id="modal__createAccount" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered text-center">
					<div class="modal-content">
						<div class="modal-header text-dark fw-bold fs-2">
							<p class="col-11 modal-title"></p>
							<button type="button" class="col-1 btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">X</button>
						</div>
						<div class="modal-body">
							<form id="form__createAccount" class="">
								<div class="mb-1" id="form__createAccount--msg"></div>
								<div class="mb-2">
									<div class="text-dark"">
										Username
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="username">
									<div id="form__input--usernameError" class="h6 text-danger"></div>
								</div>
								<div class="mb-2">
									<div class="text-dark"">
										Nickname
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="nickname">
									<div id="form__input--nicknameError" class="h6 text-danger"></div>
								</div>
								<div class="mb-2">
									<div class="text-dark">
										Email
									</div>
									<input type="text" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="email">
									<div id="form__input--emailError" class="h6 text-danger"></div>
								</div>
								<div class="mb-2">
									<div class="text-dark">
										Password
									</div>
									<input type="password" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="password_one">
									<div id="form__input--passwordError" class="text-danger"></div>
								</div>
								<div class="mb-2">
									<div class="text-success-emphasis">
										Confirm Password
									</div>
									<input type="password" class="p-1 border border-1 border-secondary rounded bg-light input__field" name="password_two">
								</div>
								<button class="btn btn-dark mt-1" type="submit">
									Register
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
};
