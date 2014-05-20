var searcher = {};

searcher.findRestaurant = function (term, options) {
	var searchTerms;
	if(options && options.tags) {
		searchTerms = {tags:"/.*"+term+".*/i"}
	} else {
		searchTerms = {name:"/.*"+term+".*/i"}
	}
	rater.helper.searchDocuments(searchTerms, "Restaurants", function(resp) {
		var results = resp.outputData;
		$('#results').empty();
		var createResultElement = function (result) {
			rater.getAverageRating(result.name, function(avg) {
				var link = $("<span style='float: right;font-size: 2em;' class='glyphicon glyphicon-share-alt'></span>");
				$(link).click([result.name], function (event) {
					pageloader.loadRestaurantPage(event.data[0]);
					$('#results').remove();
				});
				var listElement = $(['<a href="#" class="list-group-item result-element">',
					'<h4 class="list-group-item-heading">'+result.name+'</h4>',
					'<p class="list-group-item-text top-margin-lg"><span class="display-tag">'+result.tags.join('</span><span class="display-tag">')+'</span></p>',
					'<div id="'+result.name+'" class="top-margin-lg"></div>',
					'</a>'].join('\n'));
				$(listElement).prepend(link);
				$(listElement).click(function () {
					$('#description').remove();
					$(this).append("<p id='description' class='list-group-item-text top-margin'>"+result.description+"</p>");
					return false;
				});
				$('#results').append(listElement);
				$(listElement).find('.display-tag').click(function (event) {
					console.log("clicked on tag");
					$('.row').remove();
					$('#results').remove();
					$('#mainContent').append('<div class="container"><div id="results" class="list-group"></div></div>');
					searcher.findRestaurant($(this).html(), {tags : true});
				});
				$('[id="'+result.name+'"]').igRating({
					voteCount: 5,
					readOnly: true,
					valueAsPercent: false,
					value: avg,
					valueChange: function (evt, ui) {

					}
				});
			});
};
for(var i = 0; i < results.length; i++) {
	console.log(results.length);
	createResultElement(results[i]);
}
});
}

$(document).ready(function () {
	$('#searchBtn').click(function () {
		$('.row').remove();
		$('#results').remove();
		$('#mainContent').append('<div class="container"><div id="results" class="list-group"></div></div>');
		var term = $('#searchTerm').val();
		if(term.split(":").length > 1) {
			searcher.findRestaurant(term.split(":")[0], {tags: true});
		} else {
			searcher.findRestaurant($('#searchTerm').val());
		}
		$('#searchTerm').val("");
	});
});
