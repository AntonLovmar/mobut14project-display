var restaurants = {};

restaurants.init = function () {
	$('#mainContent').load('restaurants/main.html', function () {
		$('#util').empty().append(['',
								'<li><a><span style="color:#999">Inloggad som </span><span style="color:white">'+rater.helper.authUsername+'</span></a></li>',
						      '<li class="dropdown">',
					          '<a href="#" data-toggle="dropdown">Inställningar <b class="dropdown-toggle glyphicon glyphicon-cog"></b></a>',
					          '<ul class="dropdown-menu">',
					            '<li><a id="logoutBtn" href="#">Logga ut</a></li>',
					            '<li class="divider" />',
					            '<li><a id="accountBtn" href="#">Konto</a></li>',
					          '</ul>',
					        '</li>'].join('\n'));
		$('#functions').empty().append('<li><a id="favoritesBtn"><span>Favoriter</span></a></li>');
		$('#functions').append('<li><a id="addBtn"><span>Lägg till restaurang</span></a></li>');
		$('#logoutBtn').click(function () {
			passport.checkout();
			pageloader.loadLoginPage();
			$('#functions').empty();
			$('#util').empty().append('<li id="userInfo"></li>');
		});	
		$('#accountBtn').click(function () {
			pageloader.loadAccountPage();
		});	
		$('#favoritesBtn').click(function () {
			pageloader.loadFavoritesPage();
		});
		$('#addBtn').click(function () {
			pageloader.loadAddRestaurantPage();
		});
		restaurants.displayLatest();
	});
}

restaurants.displayLatest = function () {
	 rater.helper.executeCloudFunction("getlatest", {}, function (resp) { 
      var restaurantList = resp.outputData.return;
      console.log(restaurantList);
      console.log(Object.keys(restaurantList).length);
      for(var i = 0; i < Object.keys(restaurantList).length; i++) {
        $('.row').append('<div class="col-md-4"><div restaurant="'+ restaurantList[Object.keys(restaurantList)[i]].name+'" role="restaurantDisplay"></div></div>');
      }
      restaurants.generateDisplays();
    });
}

restaurants.generateDisplays = function(callback) {
  favorites.get(function (list) {
    var restaurantDisplays = $('[role="restaurantDisplay"]');
    var createDisplay = function (display) {
      rater.helper.searchDocuments({name : $(display).attr("restaurant")}, "Restaurants", function (resp) {
        var info = resp.outputData[0];
        var markup = ['<h2>'+info.name+'</h2>',
        '<span restaurant="'+info.name+'" onclick="favorites.handleIconClick(this)" class="glyphicon glyphicon-heart'+(list.contains(info.name) ? "" : "-empty")+' favorites-btn"></span>',
        '<div role="ratingField" restaurant="'+info.name+'"></div>',
        '<h5>Kategori:<span class="display-tag">'+info.tags.join('</span><span class="display-tag">')	+'</span></h5>',
        '<p>'+info.description+'</p>',
        '<p>Prisläge:'+repeatString('<span class="glyphicon glyphicon-euro"></span>', info.price)+' </p>',
        '<p><a class="btn btn-info" role="button" href="https://www.google.se/maps/search/'+info.name+'+sweden" target="_blank">Hitta hit »</a></p>',  
        '<img class="imageDisplay" src="'+info.img+'">',
        '<div role="commentInput" restaurant="'+info.name+'">',
        '</div>',
        '<h4>Kommentarer: </h4>',
        '<div>',
        '<ul role="commentFeed" restaurant="'+info.name+'">',
        '</ul>',
        '</div>'].join('\n');
        console.log("hai");
        $(display).append(markup);
        $(display).find('.display-tag').click(function (event) {
        	$('.row').remove();
			$('#results').remove();
			$('#mainContent').append('<div class="container"><div id="results" class="list-group"></div></div>');
        	searcher.findRestaurant($(this).html(), {tags: true});
        });
        restaurants.createInput(info.name);
        restaurants.createFeed(info.name);
        restaurants.createRating(info.name);
      });
	
    };
    for(var i = 0; i < restaurantDisplays.length; i++) {
      var display = restaurantDisplays[i];
      createDisplay(display);
    }
  });
}; 

restaurants.createInput = function(restaurant) {
	var element = $('[role="commentInput"][restaurant="'+restaurant+'"]');

	var commentInput = $('<input class="form-control"type="text" placeholder="Skriv din kommentar här"></input>');
	var submitButton = $('<a class="btn btn-default top-margin" >Kommentera</a>');
	$(element).append(commentInput);
	$(element).append(submitButton);
	$(submitButton).click(function () {
		var comment = $(commentInput).val();
		if(comment !== '') {
			$(commentInput).val('');
			var restaurant = $(element).attr('restaurant');
			$('.comment-thanks').remove();
			$('.comment-warning').remove();
			$('<span class="fade-in comment-thanks">Tack för din kommentar!</span>').insertAfter(element);
			rater.sendComment(restaurant, comment);
		} else {
			$('.comment-thanks').remove();
			$('.comment-warning').remove();
			$('<span class="fade-in comment-warning">Du kan inte skriva tomma kommentarer!</span>').insertAfter(element);
		}
	});
	console.log("Completed input")
};

restaurants.createRating = function (restaurant) {
	var element = $('[role="ratingField"][restaurant="'+restaurant+'"');
	rater.getAverageRating($(element).attr("restaurant"), function (avg) {
    	$(element).igRating({
	        voteCount: 5,
	        readOnly: true,
	        valueAsPercent: false,
	        value: avg,
	        valueChange: function (evt, ui) {
	        	rater.sendRating($(element).attr("restaurant"), "", ui.value);
	        	$('.rating-thanks').remove();
	     		$('<span class="fade-in rating-thanks">Tack för ditt omdöme!</span>').insertAfter(element);
	        }
	    });
	});
};

restaurants.createFeed = function(restaurant) {
	var currentFeed = $('[restaurant="'+restaurant+'"][role="commentFeed"]');
	$(currentFeed).addClass("comment-feed");
	rater.getComments(restaurant, function (res) {
		for(var i = 0; i < res.length; i++) {
			var element = ['<li class="comment-post">',
		        '<p class="comment-content">'+res[i].comment+'</p>',
		        '<span>-'+res[i].cb_owner_user+'</span>',
		        '<hr class="faded"  />',
	    	'</li>'].join('\n');

    		$(currentFeed).append(element);
		} 
	});
};

restaurants.addNew = function (name, tags, description, priceRange, imgUrl) {
	var data = {name : name, 
				tags : tags,
				description : description,
				price : priceRange,
				img : imgUrl};
	rater.helper.insertDocument("Restaurants", data, null, function () {

	});
}
function repeatString(string, times) {
  var newString = "";
  for(var i = 0; i < times; i++) {
    newString += string;
  }
  return newString;
};