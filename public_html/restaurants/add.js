$('#imgLink').change( function () {
	var url = $('#imgLink').val();
    console.log(url);
	$('#preview').attr('src', url);
});

$('[type="submit"]').click(function () {
	var url = $('#imgLink').val();
	var price = $('#priceRange').val();
	var desc = $('#restDesc').val();
	var name = $('#restName').val();
	var tags = $("#myTags").tagit("assignedTags");

	rater.helper.insertDocument("Restaurants", {price: price, description : desc, name : name, tags : tags, img : url}, null, function () {
		$('<p class="alert alert-success fade-in top-margin">Restaurang tillagd!</p>').insertAfter('.add-form');
	});

});