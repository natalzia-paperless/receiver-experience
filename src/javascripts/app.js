var chain = require('animation-chain');

$(function(){
  checkHash();

  var mainOptions = {
    trackingMovement: false,
    lastTouchEvent: {},
    startScale: 1,
    cardInitialPosition: {},
    initialTouch: {},
    numTouches: 0
  };

  var $dragCardContainer = $('.draggable-card-container');
  var $card = $('.hammer-me img');
  var src = "img/card.png";
  var img = new Image();
  img.src = src;
  img.onload = function() {
    var chainPostLoad = {
      callback: function() {
        //flip card
        $('.flippable').addClass('is-flipped');
      },
      time: 2000
    };
    setTimeout(function(){
      $('.loader').animate({opacity:0}, function() {
        $(this).remove();
        $('.card-image-holder').addClass('animate-in');
        $('.event-info').addClass('animate-in');
        $('.action').addClass('animate-in');
        $('.envelope').addClass('animate-in');
        chain(chainPostLoad);
      });
    }, 500);
  }

  $('.js-flip-button').on('click', function() {
    $('.flippable').toggleClass('is-flipped');
  });

  $('.js-card-image').on('click', function() {
    window.history.pushState({cardOpen: true}, "", "#open");
    openCardOverlay();
  });

  $('.js-close-button').on('click', function() {
    window.history.pushState({cardOpen: false}, "", "#closed");
    closeCardOverlay();
  });


  /** Card movement through touch interaction */

  $('.hammer-me').on('touchstart', function(e) {
    if (mainOptions.trackingMovement) {
      e.preventDefault();
    }
    var touch = e.originalEvent.touches[0];
    if (!touch) return;
    var xy = {x: touch.pageX, y: touch.pageY};
    mainOptions.lastTouchEvent = xy;
    mainOptions.initialTouch = xy;
  });

  $('.hammer-me').on('touchmove', function(e) {
    var touch = e.originalEvent.touches[0];
    if (!touch) return;
    var xy = {x: touch.pageX, y: touch.pageY};

    var deltaX = xy.x - mainOptions.lastTouchEvent.x;
    var deltaY = xy.y - mainOptions.lastTouchEvent.y;

    mainOptions.lastTouchEvent = xy;

    if (!mainOptions.trackingMovement) {
      return;
    }

    e.preventDefault();

    moveCard(deltaX, deltaY);
  });

  $('.hammer-me').on('touchend', function(e) {
    if (mainOptions.trackingMovement) {
      e.preventDefault();
    }
    mainOptions.numTouches++;
    if (mainOptions.numTouches >= 2) {
      console.log('tap tap');
      zoomImage();
    }
    setTimeout(function() {
      if (mainOptions.numTouches === 1 && !mainOptions.trackingMovement) {
        var touch = mainOptions.lastTouchEvent;
        if (!touch) return;
        var xy = {x: touch.x, y: touch.y};

        console.log(xy.x);
        console.log(mainOptions.initialTouch.x);
        if (xy.x === mainOptions.initialTouch.x) {
          //window.history.pushState({cardOpen: false}, "", "#closed");
          //closeCardOverlay(); instead of closing the overlay, flip the card
          $('.flippable').toggleClass('is-flipped');
        }
      }
      mainOptions.numTouches = 0;
    },200);
  });


  function zoomImage() {
    $('.hammer-me img').toggleClass('scaled');
    $dragCardContainer.toggleClass('no-scroll');
    mainOptions.trackingMovement = !mainOptions.trackingMovement;
    if (mainOptions.trackingMovement) {
      var w = $('.hammer-me img').width();
      var h = $('.hammer-me img').height();
      $('.hammer-me img').css({
        left: (-w/4) + "px",
        top: (-h/4) + "px"
      });
    } else {
      $('.hammer-me img').css({
        left: "",
        top: ""
      });
    }
  }

  function moveCard(x, y){
    var currentPosition = {
      top: $card.position().top,
      left: $card.position().left
    }

    console.log(currentPosition.top + "/" + currentPosition.left);
    console.log(x + "/" + y);

    var newTop = currentPosition.top + y;
    var newLeft = currentPosition.left + x;

    console.log(newTop + "/" + newLeft);

    $card.css({
      top: newTop + "px",
      left: newLeft + "px"
    });
  }

  function openCardOverlay() {
    $('html, body').addClass('card-overlay');
    $('.js-card-image').addClass('grow-pls is-in').removeClass('animate-in');

    setTimeout(function() {
      $dragCardContainer.removeClass('close').addClass('open');
      var screenWidth = $(window).width();

      $dragCardContainer.scrollLeft(screenWidth * .87);
    }, 300);

    //set up card for movement
    /*$('html, body').addClass('card-overlay');
    $('.js-card-image').addClass('grow-pls is-in').removeClass('animate-in');
    $('.draggable-card-container').addClass('open');

    chain(function() {
      var top = $('.js-card-image').offset().top,
          left = $('.js-card-image').offset().left + 6;
      $card.addClass('show').css({
        top: top,
        left: left,
        width: $('.js-card-image').width() - 12
      });
      $('.card-holder').addClass('none');
      mainOptions.cardInitialPosition = {
        top: top,
        left: left
      }
    },750);*/
  }

  function closeCardOverlay() {
    /*$card.animate({
      top: mainOptions.cardInitialPosition.top,
      left: mainOptions.cardInitialPosition.left
    }, 250, function() {
      $('html, body').removeClass('card-overlay');
      $('.js-card-image').removeClass('grow-pls');
      $('.draggable-card-container').removeClass('open');
      $('.card-holder').removeClass('none');
      $card.removeClass('show')
    });*/

    $dragCardContainer.removeClass('open').addClass('close');

    setTimeout(function() {
      $('html, body').removeClass('card-overlay');
      $('.js-card-image').removeClass('grow-pls');
      $dragCardContainer.removeClass('close');
    },350);
  }

  function checkHash() {
    if (window.location.hash.indexOf('open') !== -1) {
      openCardOverlay();
    }
  }

  window.onpopstate = function() {
    var currentState = window.history.state;
    if (currentState) {
      if (currentState.cardOpen) {
        openCardOverlay();
      } else {
        closeCardOverlay();
      }
    } else {
      closeCardOverlay();
    }
  }
});
