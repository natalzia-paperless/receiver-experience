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

  $('.will-attend').on('click', function() {
    $('.will-not-attend').addClass('is-attending');
    setTimeout(function() {
      $('.will-attend .text').addClass('none');
      $('.will-attend').addClass('is-attending');
      
      setTimeout(function() {
        $('.attending-check').addClass('enter');
      }, 600);
    }, 350);
  });
});