$(function(){
  var src = "/img/card.png";
  var img = new Image();
  img.src = src;
  img.onload = function() {
    $('.loader').animate({opacity:0}, function() {
      $(this).remove();
      $('.card-image-holder').addClass('animate-in');
      $('.event-info').addClass('animate-in');
      $('.action').addClass('animate-in');
      $('.envelope').addClass('animate-in');
    });
  }

  $('.event-details').on('click', function() {
    $('.details-overlay').css({opacity: ""}).addClass('open');
  });

  $('.details-overlay').on('click', function(e){
    if ($(e.target).hasClass('details-overlay'))
      closeDetailsOverlay();
  });

  $('.details-options .close-x').on('click', function() {
    closeDetailsOverlay();
  });

  function closeDetailsOverlay(){
    $('.details-options .option').removeClass('hovered');
    $('.details-overlay').animate({opacity: 0}, 300, function(){
      $('.details-overlay').removeClass('open');
    });
  }

  $('.details-options .option').on('touchstart', function() {
    $(this).addClass('hovered');
  });
  $('.details-options .option').on('touchend', function() {
    $(this).removeClass('hovered');
  });
});