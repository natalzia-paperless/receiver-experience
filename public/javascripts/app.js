(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Chain = require('./lib/animation-chain');

module.exports = Chain;

},{"./lib/animation-chain":2}],2:[function(require,module,exports){
var polyfills = require('./polyfills');

var requestAnimFrame = polyfills.requestAnimFrame,
    animationEnd = polyfills.animationEnd,
    transitionEnd = polyfills.transitionEnd;

function setDefaultProps(prop) {
  prop = (typeof prop !== 'object') ? {} : prop;
  prop.callback = prop.callback || function() {
    console.log('test');
  };
  prop.time = prop.time || 500;
  prop.animationType = prop.animationType || 'transition';
  prop.singleListener = prop.singleListener || true;

  return prop;
}

var Chain = function(prop) {
  prop = setDefaultProps(prop);

  var obj = {
    ticks: [],
    animationCallbacks: [],
    init: function(initProp) {
      //if there's a selector in place and the browser supports these events
      if (initProp.selector && transitionEnd) {
        obj.initWithSelector(initProp);
        return;
      }
      obj.ticks.push({
        callback: initProp.callback,
        time: initProp.time
      });

      if (obj.ticks.length === 1) {
        //If this is the only tick in the current list
        requestAnimFrame(obj.tick);
      }
    },
    initWithSelector: function(initProp) {
      try {
        var el = document.querySelector(initProp.selector);
        if (!el) {
          console.log('No element with that selector');
          return;
        }

        var animationName = initProp.animationType === 'transition' ? transitionEnd : animationEnd;

        obj.ticks.push({
          callback: initProp.callback,
          el: el,
          animationName: animationName
        });

        if (obj.ticks.length === 1) {
          //if there's only one object
          if (prop.singleListener) {
            // only one listener at a time
            el.removeEventListener(animationName, obj.animationFinished);
          }
          el.addEventListener(animationName, obj.animationFinished, false);
        }
      } catch (e) {
        console.log(e);
      }
    },
    animationFinished: function() {
      obj.ticks[0].el.removeEventListener(obj.ticks[0].animationName, obj.animationFinished);
      obj.ticks[0].callback();
      obj.ticks.splice(0,1);
      if (obj.ticks.length !== 0) {
        if (!obj.ticks[0].el) {
          //If an animation ends and the next tick requires the animation frame
          requestAnimFrame(obj.tick);
        } else {
          //if the animation next requires a selector
          var el = obj.ticks[0].el;
          if (prop.singleListener) {
            // only one listener at a time
            el.removeEventListener(obj.ticks[0].animationName, obj.animationFinished);
          }
          el.addEventListener(obj.ticks[0].animationName, obj.animationFinished, false);
        }
      }
    },
    tick: function(timestep) {
      if (!obj.startTime) {
        obj.startTime = timestep;
      }

      if (obj.ticks[0].el) {
        //if there is an animation element at the front, don't bother with the loop
        requestAnimFrame(obj.tick);
        return;
      }

      for (var i = 0; i < obj.ticks.length; i++) {
        var currentTick = obj.ticks[i];
        if (!currentTick.el && (timestep - obj.startTime) >= currentTick.time) {
          currentTick.callback();
          obj.ticks.splice(0,1);
          if (obj.ticks.length === 0 || obj.ticks[0].el) {
            return;
          }
        }
      }

      requestAnimFrame(obj.tick);
    },
    chainTo: function(chainProp) {
      chainProp = setDefaultProps(chainProp);

      var animationName = chainProp.animationType === 'transition' ? transitionEnd : animationEnd;

      if (chainProp.selector) {
        obj.ticks.push({
          callback: chainProp.callback,
          el: document.querySelector(chainProp.selector),
          animationName: animationName
        });
        return;

      }

      obj.ticks.push({
        callback: chainProp.callback,
        time: chainProp.time
      });
    }
  };

  obj.init(prop);

  return obj;
};

module.exports = Chain;

},{"./polyfills":3}],3:[function(require,module,exports){
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/** From https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/ */
function whichAnimationEvent(){
  var t,
      el = document.createElement('fakeelement');

  var animations = {
    'animation'      : 'animationend',
    'OAnimation'     : 'oAnimationEnd',
    'MozAnimation'   : 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  };

  for (t in animations){
    if (el.style[t] !== undefined){
      return animations[t];
    }
  }
}

var animationEnd = whichAnimationEvent();

/** From http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers */
function transitionEndEventName () {
    var i,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }

    //TODO: throw 'TransitionEnd event is not supported in this browser';
    return null;
}

var transitionEnd = transitionEndEventName();

module.exports = {
  requestAnimFrame: requestAnimFrame,
  animationEnd: animationEnd,
  transitionEnd: transitionEnd
}

},{}],4:[function(require,module,exports){
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

},{"animation-chain":1}]},{},[4]);
