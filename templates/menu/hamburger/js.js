$(function(){
	$(".icon").click(function(){

		if($(".items").is(":visible")){
			$(".items").removeClass("showItems");
		}
		else{
			$(".items").addClass("showItems");
		}

	});
});