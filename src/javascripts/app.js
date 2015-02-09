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

  var initialWidth = 75;
  var scrollTop = $(window).scrollTop();
  setCardPos();
  $(window).on('scroll', function() {
    //5% for every 10px
    setCardPos();
  });

  function setCardPos() {
    var newwidth = initialWidth / ($(window).scrollTop() * .005);

    newwidth = newwidth > initialWidth ? initialWidth : newwidth;

    newwidth = newwidth <= 0 ? initialWidth : newwidth;

    newwidth = newwidth < 40 ? 40 :newwidth;

    $('.card-image-holder').css({
      width: newwidth+"%"
    });
  }
});