$(document).ready(function(){
	$('section[data-type="background"]').each(function(){
		var $bgobj = $(this);

		$(window).scroll(function(){
		
			var yPos = -($(window).scrollTop() / $bgobj.data('speed')); 

			var coords = 'center' + yPos + 'px';

			$bgobj.css({ backgroundPosition: coords}); 
		});
	});
}); 

   