var favorites = {};

favorites.get = function (callback) {
	rater.helper.searchAllDocuments("favorites", function (resp) {
		callback(resp.outputData[0] ?  resp.outputData[0].restaurants : []);
	});
}

favorites.add = function (restaurantName) {
	rater.helper.searchDocuments({name : "/"+restaurantName+"/i"}, "Restaurants", function (resp) {
		if(!(resp.outputData.length === 0)) {
			favorites.get(function (list) {
				if(!list.contains(restaurantName)) {
					list = list.concat([restaurantName]);
					rater.helper.updateDocument({restaurants : list,
												cb_owner_user : rater.helper.authUsername}, 
												{cb_owner_user : rater.helper.authUsername},
												"favorites", null);
				}
			});
		} else {
			console.log("meh");
		}
	});

}

favorites.remove = function(restaurantName) {
	favorites.get(function (list) {
		for(var i = 0; i < list.length; i++) {
			if(list[i] === restaurantName) {
				list.splice(i, 1);
				break;
			}	
		}
		rater.helper.updateDocument({restaurants : list,
									cb_owner_user : rater.helper.authUsername}, 
									{cb_owner_user : rater.helper.authUsername},
									"favorites", null);
	});
}

favorites.handleIconClick = function (element) {
	if($(element).hasClass("glyphicon-heart")) {
		favorites.remove($(element).attr("restaurant"));
		$(element).addClass("glyphicon-heart-empty")
		$(element).removeClass("glyphicon-heart");
	} else {
		favorites.add($(element).attr("restaurant"));
		$(element).addClass("glyphicon-heart");
		$(element).removeClass("glyphicon-heart-empty")
	}
}

favorites.init = function () {
	favorites.get(function (list) {
     		if(list.length !== 0) {
	     		for(var i = 0; i < list.length; i++) {
	     			var listElement = $(['<a href="#" class="list-group-item result-element">',
												    '<h4 class="list-group-item-heading">'+list[i]+'</h4>',
												  '</a>'].join('\n'));
					
					var goToBtn = $('<span style="float: right;font-size: 2em;" class="glyphicon glyphicon-share-alt"></span>');
					var removeBtn = $('<span class="glyphicon glyphicon-remove-circle" style="float: right;font-size: 1.7em;margin-right: 0.5em;"></span>');
					$(removeBtn).click([list[i], listElement], function (event) {
						favorites.remove(event.data[0]);
						$(event.data[1]).remove();
					});
					$(goToBtn).click([list[i]], function (event) {
						pageloader.loadRestaurantPage(event.data[0]);
					});
					$(listElement).prepend(removeBtn);
					$(listElement).prepend(goToBtn);
	     			$('#favoritesList').append(listElement);
	     		}
	     	} else {
	     		$('#favoritesList').append(['<a class="list-group-item">',
  											'<h5 class="list-group-item-heading text-margin">Du har inga favoritrestauranger!</h5>',
  											'Klicka på hjärtat som visas brevid titeln när du visar en restaurang för att lägga till den som favorit.',
      										'</a>'].join('\n'));
	     	}
     	});
}