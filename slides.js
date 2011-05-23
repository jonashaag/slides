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
  keys: {
    next: [KEYS.SPACE, KEYS.RETURN, KEYS.N, KEYS.K, KEYS.ARROW_LEFT],
    previous: [KEYS.B, KEYS.J, KEYS.P, KEYS.ARROW_RIGHT],
    first: [KEYS.G]
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

  document.getElementsByClassName('slide-count').toArray()
    .forEach(function(elem) { elem.innerHTML = slides.length-1 });

  var nextSlide = function() {
    if(slides.hasNext()) {
      var current = slides[slides.current];
      current.removeClass('current');
      current.addClass('previous');

      slides.current++;
      var next = slides[slides.current];
      next.removeClass('next');
      next.addClass('current');
      
      var next_next = slides[slides.current+1];
      if(next_next)
        next_next.addClass('next');
    }
  };

  var previousSlide = function() {
    if(slides.hasPrevious()) {
      var current = slides[slides.current];
      current.removeClass('current');
      current.addClass('next');

      slides.current--;
      var previous = slides[slides.current];
      previous.removeClass('previous')
      previous.addClass('current');

      var previous_previous = slides[slides.current-1];
      if(previous_previous)
        previous_previous.addClass('previous');
    }
  }

  var firstSlide = function() {
    if(slides.hasPrevious()) {
      previousSlide();
      setTimeout(firstSlide, 200);
    }
  }

  document.addEventListener('keyup', function(event) {
    if(config.keys.first.contains(event.keyCode)) {
      firstSlide();
      return false;
    }
    if(config.keys.next.contains(event.keyCode)) {
      nextSlide();
    } else if(config.keys.previous.contains(event.keyCode)) {
      previousSlide();
      if(!slides.hasPrevious()) return false;
    } else {
      return;
    }
    setTimeout(function() {
      slideNumbers.forEach(function(elem) { elem.innerHTML = slides.current })
    }, slides.current == 1 ? 0 : 300);
  }, false);
}, false);