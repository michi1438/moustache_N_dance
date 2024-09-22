function renderIndex() {
	return `
			
			<div class="row pt-5">
				<div class="col d-flex justify-content-center align-items-center">
					<img src="/frontend/img/welcome.gif" id ="welcomeimg" alt="welcome" width="150" height="150"/>
				</div>
			</div>
			<div class="row">
				<div class="text-center h1" >Welcome</div>
				<div id=welcometxt class="text-center h1" >Please Login</div>
			</div>

	`;
};

function listenerIndex() {

	if (sessionStorage.getItem("username"))
		document.getElementById("welcometxt").textContent = sessionStorage.getItem("username");
	else 
		document.getElementById("welcometxt").textContent = "Please Login";

};

export default {
	renderIndex,
	listenerIndex,
};
