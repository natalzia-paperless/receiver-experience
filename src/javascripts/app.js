$(function(){
  checkHash();


  var mainOptions = {
    trackingMovement: false,
    lastTouchEvent: {},
    startScale: 1,
    cardInitialPosition: {}
  };

  var $card = $('.draggable-card');

  var hammertime = new Hammer(document.querySelector('.draggable-card-container'), {});
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

  $('.js-card-image').on('click', function() {
    window.history.pushState({cardOpen: true}, "", "#cardOpen");
    
    openCardOverlay();
  });

  hammertime.on('tap', function(e) {
    /*if ($(e.target).hasClass('draggable-card')) {
      return;
    }*/
    window.history.pushState({cardOpen: false}, "", "#cardClosed");

    closeCardOverlay();
  });

  $card.on('touchstart', function(e) {
    e.preventDefault();
    mainOptions.trackingMovement = true;
    var touch = e.originalEvent.touches[0];
    if (!touch) return;
    var xy = {x: touch.pageX, y: touch.pageY};
    mainOptions.lastTouchEvent = xy;
  });

  $card.on('touchmove', function(e) {
    e.preventDefault();
    if (mainOptions.trackingMovement) {
      var touch = e.originalEvent.touches[0];
      if (!touch) return;
      var xy = {x: touch.pageX, y: touch.pageY};

      var deltaX = xy.x - mainOptions.lastTouchEvent.x;
      var deltaY = xy.y - mainOptions.lastTouchEvent.y;
      
      moveCard(deltaX, deltaY);

      mainOptions.lastTouchEvent = xy;
    }
  });

  $card.on('touchend', function(e) {
    e.preventDefault();
    mainOptions.trackingMovement = false
  });

  function zoomImage(scale) {
    alert('whoa');
    $card.css('transform', 'scale(' + scale + ')');
    mainOptions.startScale = scale;
  }

  function moveCard(x, y){ 
    var currentPosition = {
      top: $card.offset().top,
      left: $card.offset().left
    }

    var newTop = currentPosition.top + y;
    var newLeft = currentPosition.left + x;

    $card.css({
      top: newTop + "px",
      left: newLeft + "px"
    });
  }

  function openCardOverlay() {
    //set up card for movement
    $('html, body').addClass('card-overlay');
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
    },750);
  }

  function closeCardOverlay() {
    $card.animate({
      top: mainOptions.cardInitialPosition.top,
      left: mainOptions.cardInitialPosition.left
    }, 250, function() {
      $('html, body').removeClass('card-overlay');
      $('.js-card-image').removeClass('grow-pls');
      $('.draggable-card-container').removeClass('open');
      $('.card-holder').removeClass('none');
      $card.removeClass('show')
    });
  }

  function checkHash() {
    if (window.location.hash.indexOf('cardOpen') !== -1) {
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