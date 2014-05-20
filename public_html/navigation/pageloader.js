var pageloader = {};

pageloader.loadMainPage = function () {
	passport.isAuthenticated(function (authenticated) {
		if(authenticated) {
			$('#searchField').show();
			restaurants.init();
		} else {
			pageloader.loadLoginPage();
		}
	});
}

pageloader.loadLoginPage = function () {
	$('#searchField').hide();
	$('#mainContent').load('security/login.html', function () {
		passport.initLogin();
	});
}

pageloader.loadAccountPage = function () {
	$('#searchField').hide();
	$('#mainContent').load('security/account.html', function () {
		accountManager.setUpBindings();
	});
}

pageloader.loadRegisterPage = function () {
	$('#searchField').hide();
	$('#mainContent').load('security/register.html', function () {
		passport.initRegister();
	});
}

pageloader.loadRestaurantPage = function(restaurant) {
	$('#searchField').show();
	$('#mainContent').load('restaurants/single.html', function () {
		$('.row').empty();
      $('.row').append('<div class="col-md-4"><div restaurant="'+restaurant+'" role="restaurantDisplay"></div></div>');
      restaurants.generateDisplays();
	});
}

pageloader.loadFavoritesPage = function() {
	$('#searchField').show();
	$('#mainContent').load('utils/favorites/main.html', function () {
		favorites.init();
	});
}

pageloader.loadAddRestaurantPage = function() {
		$('#searchField').hide();

	$('#mainContent').load('restaurants/add.html', function () {
	});
}