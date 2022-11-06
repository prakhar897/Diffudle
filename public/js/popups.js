$(function(){
	$("#howToPlay").click(function(){
		$(".howToPlay").modal('show');
	});
	$(".howToPlay").modal({
		closable: true
	});
});

$(function(){
	$("#stats").click(function(){
		$(".stats").modal('show');
	});
	$(".stats").modal({
		closable: true
	});
});