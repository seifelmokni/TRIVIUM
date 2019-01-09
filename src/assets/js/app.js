jQuery(document).ready(function($) {
    console.log('App loaded!');
    $('.dropdown-block').on('click', '.dropdown-toggler', function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	var parent = $(this).parents('.dropdown-block');
    	$('.dropdown-block').removeClass('dropdown-open');
    	$(parent).toggleClass('dropdown-open');
    });
    $('.dropdown-content input').on('click',function(e){
       e.stopPropagation();
    });

    $('table').on('click', 'td', function(){
    	$(this).parents('tr').toggleClass('active');
    });

    $('[data-toggle="search"]').on('click', function(e){
    	e.preventDefault();

    	$(this).parents('.search-block').addClass('active');
    });

    $('.search-reset').on('click', function(e){
    	e.preventDefault();
    	var input = $(this).siblings('input');
    	if(input.val() != '') {
    		input.val('');
    	}
    	else {
			$(this).parents('.search-block').removeClass('active');
    	}
    });

    $(document).click( function(){
	    $('.dropdown-block').removeClass('dropdown-open');
	});
	$('.modal-open-js').click(function(e){
		e.preventDefault();
		$('.modal-confirm').show(); });
  $('.modal-close-js').click(function(e){ 
		e.preventDefault();
  	$('.modal-confirm').hide(); });
	
	$('.task-list').on('click', '.task', function(){
    $('.task-list .task').removeClass('active');
    $(this).addClass('active');
	});	
		$('.modal-user-js').click(function(e){
		e.preventDefault();
		$('.users-big').fadeToggle(); 
		$('.users-small').fadeToggle();
		$('.date-hide').fadeToggle();	
		});
		
	$('.user-1-open').click(function(){
		$('.user-full-1').show(); 
		$('.user-full-2').hide(); 
	
	});
	
	$('.user-2-open').click(function(){
		$('.user-full-2').show(); 
		$('.user-full-1').hide();
	
	});
	
	$('.users-list').on('click', '.user', function(){
    $('.user').removeClass('active');
    $(this).addClass('active');
	});
	$('.edit-open').click(function(e){
		e.preventDefault();
		$('.users-modal').show(); });
  $('.edit-close').click(function(e){ 
		e.preventDefault();
  	$('.users-modal').hide(); });
	
	$('.users-modal-open').click(function(e){
		e.preventDefault();
		$('.users-modal').show(); });
  $('.users-modal-close').click(function(e){ 
		e.preventDefault();
  	$('.users-modal').hide(); });
});
