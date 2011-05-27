Object.prototype.toArray = function() { return Array.prototype.slice.call(this) };
Object.prototype.toInt   = function() { return parseInt(this) }
Array.prototype.contains = function(what) {
  for(i=0; i<this.length; i++) {
    if(this[i] == what)
      return true;
  }
}
Array.prototype.cull = function(what) {
  var result = [];
  for(i=0; i<this.length; i++)
    if(this[i] != what)
      result.push(this[i]);
  return result;
}
Element.prototype.addClass = function(name) { this.className += ' ' + name }
Element.prototype.removeClass = function(name) {
  this.className = this.className.split(' ').cull(name).join(' ');
}

MOUSE = {
  LEFT: 0,
  WHEEL: 1
}
var KEYS = {
  SPACE: 32,
  RETURN: 13,
  N: 78,
  B: 66,
  J: 74,
  K: 75,
  G: 71,
  P: 80,
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37
}

var config = {
  animateToFirst: true,
  keys: {
    nextAny: [KEYS.SPACE, KEYS.RETURN, MOUSE.LEFT],
    nextSlide: [KEYS.K, KEYS.ARROW_LEFT],
    previousSlide: [KEYS.P, KEYS.J, KEYS.ARROW_RIGHT, MOUSE.WHEEL],
    firstSlide: [KEYS.G],
    nextStep: [KEYS.N],
    previousStep: [KEYS.B]
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var slides = document.getElementsByTagName('section').toArray();
  var slideNumbers = document.getElementsByClassName('slide-number').toArray();

  slides.current = 0;
  slides.hasNext = function() { return this.current < slides.length-1 }
  slides.hasPrevious = function() { return this.current }
  
  slides[0].addClass('current');
  slides[1].addClass('next');

  slides.forEach(function(slide) {
    slide.steps = 0;
    slide.currentStep = 0;
    slide.hasNextStep = function() { return this.currentStep < this.steps }
    slide.hasPreviousStep = function() { return this.currentStep > 0 }
    var classNames = slide.className.split(' ');
    for(var i=0; i<classNames.length; i++) {
      var name = classNames[i];
      var res = name.match(/(\d)+step(s)?/);
      if(res) {
        slide.steps = res[1];
        slide.addClass('step0');
        break;
      }
    }
  });

  document.getElementsByClassName('slide-count').toArray()
    .forEach(function(elem) { elem.innerHTML = slides.length-1 });

  var nextStep = function() {
    var current = slides[slides.current];
    if(current.hasNextStep()) {
      current.removeClass('step'+ current.currentStep);
      current.currentStep++;
      current.addClass('step'+current.currentStep);
    }
  }

  var previousStep = function() {
    var current = slides[slides.current];
    if(current.hasPreviousStep()) {
      current.removeClass('step'+ current.currentStep);
      current.currentStep--;
      current.addClass('step'+current.currentStep);
    }
  }

  var nextSlide = function() {
    var current = slides[slides.current];
    if(slides.hasNext()) {
      current.removeClass('current');
      current.addClass('previous');

      slides.current++;
      var next = slides[slides.current];
      next.removeClass('next');
      next.addClass('current');
      
      var next_next = slides[slides.current+1];
      if(next_next)
        next_next.addClass('next');

      update_location();
    }
  };

  var previousSlide = function() {
    var current = slides[slides.current];
    if(slides.hasPrevious()) {
      current.removeClass('current');
      current.addClass('next');

      slides.current--;
      var previous = slides[slides.current];
      previous.removeClass('previous')
      previous.addClass('current');

      var previous_previous = slides[slides.current-1];
      if(previous_previous)
        previous_previous.addClass('previous');

      update_location();
    }
  }

  var slideTo = function(n, noanimate) {
    if(slides.current == n) {
      update_location();
      return;
    }
    if(slides.current < n)
      nextSlide();
    else
      previousSlide();
    if(noanimate)
      slideTo(n, noanimate);
    else
      setTimeout(function() { slideTo(n) }, 200);
  }

  var firstSlide = function() { slideTo(0, !config.animateToFirst) }

  var nextAny = function() {
    if(slides[slides.current].hasNextStep())
      nextStep();
    else
      nextSlide();
  }

  var update_location = function() {
    var n = slides.current;
    history.replaceState(1, 'Slide ' + n, '#' + n);
    if(slides.hasPrevious()) {
      setTimeout(function() {
        slideNumbers.forEach(function(elem) { elem.innerHTML = slides.current })
      }, slides.current == 1 ? 0 : 300);
    }
    if(config.onSlideChange) config.onSlideChange(slides);
  }

  var event_cb = function(event) {
    var what;
    var key = event.button !== undefined ? event.button : event.keyCode;
    for(var k in config.keys) {
      if(!config.keys.hasOwnProperty(k)) return;
      if(config.keys[k].contains(key)) {
        what = k;
        break;
      }
    }
    if(!what)
      return;
    event.preventDefault();
    eval(what+'()');
    return false;
  }

  setTimeout(function() {
    document.addEventListener('keydown', event_cb, true);
    document.addEventListener('mousedown', event_cb, true);
  }, 50);

  var slide_no = window.location.toString().match(/#(\d+)/);
  if(slide_no)
    slideTo(slide_no[1], /* no animation */ true);
}, false);
