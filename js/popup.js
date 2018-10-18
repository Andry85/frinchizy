$(document).ready(function(){

	$('.popupopen').click(function(){
		$('.popup_modal_block').fadeIn();
	});


	$('.closebut').click(function(){
		$(this).parents('.popup_modal_block').fadeOut();
	});

	$('.popup_modal_block').click(function(e){
		if($(e.target).closest('.wrap').length == 0){
			$(this).fadeOut();
		}
	});

	$(document).keydown(function(e) {
		if( e.keyCode === 27 ) {
			$('.popup_modal_block').fadeOut();
		}
	});
});




