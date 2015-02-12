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
    $('.loader').animate({opacity:0}, function() {
      $(this).remove();
      $('.card-image-holder').addClass('animate-in');
      $('.event-info').addClass('animate-in');
      $('.action').addClass('animate-in');
      $('.envelope').addClass('animate-in');
    });
  }

  $('.js-card-image').on('click', function() {
    window.history.pushState({cardOpen: true}, "", "#open");
    openCardOverlay();
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
          window.history.pushState({cardOpen: false}, "", "#closed");
          closeCardOverlay();
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
        left: (-w/2) + "px",
        top: (-h/2) + "px"
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

    setTimeout(function() {
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