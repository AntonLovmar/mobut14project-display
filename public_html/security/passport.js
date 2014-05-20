var passport = {};

passport.authenticateCredentials = function(username, password) {
	var searchCondition = { "message" : "Success"};
	$('#loginError').empty();
	rater.helper.authPassword = password;
	rater.helper.authUsername = username;
	$('[type="submit"]').html('<img class="login-loader" src="728.GIF"/>Loggar in...');
	rater.helper.searchDocuments(searchCondition,"authenticated", function(resp) {
		if(resp.errorMessage === "") {
			pageloader.loadMainPage();
		} else {
			$('[type="submit"]').html('Logga in');
			rater.helper.authPassword = "";
			rater.helper.authUsername = "";
			passport.displayLoginError();
		}
	}
	);
}

passport.registerUser = function(username, password, email, callback) {
	var data = {user: username,
				password: password,
				email : email};
	rater.helper.insertDocument("users", data, null, function (resp) {
		if(resp.outputData === 'USER EXISTS') {
			callback(false);
		} else {
			rater.helper.authUsername = username;
			rater.helper.authPassword = password;
			rater.helper.executeCloudFunction("setowner", {user : username, password : password}, function(resp) {
			    console.log(resp.outputString);
			});
			callback(true);
		}
	});
}  

passport.isAuthenticated = function(callback) {
	var searchCondition = { "message" : "Success"};
	rater.helper.searchDocuments(searchCondition,"authenticated", function(resp) {
		if(resp.errorMessage === "") {
			callback(true);
		} else {
			callback(false);
		}
	}
	);
}

passport.displayLoginError = function() {
	$('#loginError').html('Invalid username and/or password');
}

passport.checkout = function() {
	rater.helper.authPassword = "";
	rater.helper.authUsername = "";
}

passport.initRegister = function() {
	$('[type="submit"]').click(function() {
			var username = $('[type="username"]').val();
			var password = $('[type="password"]').val();
			var email = $('[type="email"]').val();
			if(!email || !password || !username) {
				$('#registerError').html("Du måste fylla i alla uppgifter!");
				return;
			}
			$('#registerError').html("");
			passport.registerUser(username, password, email, function(success) {
				if(success) {
					pageloader.loadMainPage();
				} else {
					$('#registerError').html("Detta användarnamn är upptaget!");
				}
			});
		});
}

passport.initLogin = function() {
	$('[type="submit"]').click(function() {
			var username = $('[type="username"]').val();
			var password = $('[type="password"]').val();
			passport.authenticateCredentials(username, password);
		});
}



