var rater = {};

/**
 * Initiates the rater module. Must be called before making any API calls
 *
 */
rater.init = function() {
	var helper = new CBHelper("fncyrestaurantguide", "4bc5c1a1af2bafb9fe4b96b50ec57dff", new GenericHelper());
	// use the md5 library provided to set the password
	helper.setPassword(hex_md5("fncybtn"));

	rater.helper = helper;
};

rater.sendRating = function(restaurantName, userName, rating) {
	var dataObject = {user: userName,
					  rating: rating
					 };
	rater.helper.insertDocument(restaurantName+"-rating", dataObject, null, function(resp) {
	   
	});
};

rater.sendComment = function(restaurantName, comment) {
	var dataObject = {
					  comment: comment
					 };
	rater.helper.insertDocument(restaurantName+"-comments", dataObject, null, function(resp) {
	   
	});
};

rater.getRatings = function(restaurantName, callback) {
	
	rater.helper.searchAllDocuments(restaurantName+"-rating", function(resp) {
		var respJSON = JSON.parse(resp.outputString);
	    callback(respJSON.data.message);
	});
};

rater.getComments = function(restaurantName, callback) {
	rater.helper.searchAllDocuments(restaurantName+"-comments", function(resp) {
		var respJSON = JSON.parse(resp.outputString);
	    callback(respJSON.data.message);
	});
};

rater.getAverageRating = function (restaurantName, callback) {
	this.getRatings(restaurantName, function (ratings) {
		var sum = 0;
		for(var i = 0; i < ratings.length; i++) {
			sum += parseInt(ratings[i].rating);
		}

		callback(sum/ratings.length);
	});
}

//Initiate the rater module	
rater.init();