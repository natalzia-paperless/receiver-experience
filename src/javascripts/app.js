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
      $('.event-info').addClass('animate-in');
      $('.action').addClass('animate-in');
    });
  }

  $('.will-attend').on('click', function() {
    didAttend();
  });

  $('.change-response').on('click', function() {
    changeResponse();
  });

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

      $dragCardContainer.scrollLeft(screenWidth * .843);
    }, 300);

  }

  function closeCardOverlay() {
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

  function didAttend() {
    // Fade out will not attend and header
    $('.will-not-attend').addClass('is-attending');
    $('.please-rsvp-header').addClass('is-attending');
    setTimeout(function() {
      // Transition will attend button into checkbox position
      $('.will-attend .text').addClass('none');
      $('.will-attend').addClass('is-attending');
      
      setTimeout(function() {
        // Bring the checkmark in
        $('.attending-check').addClass('enter');
        setTimeout(function() {
          //Transition the checkmark out and bring in the 'change response dialog'
          $('.status-container').removeClass('none').addClass('enter');
          $('.attending-actions').addClass('remove');
          $('.actions-container').addClass('less-padding');
          setTimeout(function(){
            $('.status-container').addClass('is-in');
            $('.attending-actions').addClass('none');
          }, 350);
        }, 650);
      }, 600);
    }, 350);
  }

  function changeResponse() {
    $('.status-container').removeClass('is-in');
    $('.attending-actions').removeClass('none');

    setTimeout(function(){
      $('.status-container').addClass('none').removeClass('enter');
      $('.attending-actions').removeClass('remove');
      $('.actions-container').removeClass('less-padding');

      setTimeout(function() {
        $('.attending-check').removeClass('enter');

        setTimeout(function() {
          $('.will-attend .text').removeClass('none');
          $('.will-attend').removeClass('is-attending');

          setTimeout(function() {
            $('.will-not-attend').removeClass('is-attending');
            $('.please-rsvp-header').removeClass('is-attending');
          }, 350);
        }, 600);
      }, 250);
    }, 350);
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