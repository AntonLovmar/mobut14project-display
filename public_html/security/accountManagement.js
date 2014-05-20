var accountManager = {};

accountManager.changePassword = function(newPass, retype) {
	console.log(!(newPass === retype));
	if(!(newPass === retype)) {
		accountManager.displayPasswordMatchError();
	} else {
		console.log("Shouldn't be here");
		var user = rater.helper.authUsername;
		var conditions = {user : user};
		var data = {user : user, 
					password : newPass,
					cb_owner_user : user};
		rater.helper.updateDocument(data, conditions, "users", null, function (resp) {
			rater.helper.authPassword = newPass;
			$('<p class="alert alert-warning fade-in top-margin">Updaterat!</p>').insertAfter('.password-change');
		});
	}
};

accountManager.displayPasswordMatchError = function() {
	$('#passwordChangeError').html("Lösenorden måste stämma överrens!");
};

accountManager.setUpBindings = function () {
	$('[type="submit"]').click(function () {
		var newP = $('#newPassword').val();
		var retype = $('#retypePassword').val();
		accountManager.changePassword(newP, retype);
	});
}