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
});