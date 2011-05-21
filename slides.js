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
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37
}

var config = {
  keys: {
    next: [KEYS.SPACE, KEYS.RETURN, KEYS.N, KEYS.K, KEYS.ARROW_LEFT],
    previous: [KEYS.B, KEYS.J, KEYS.ARROW_RIGHT]
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var slides = document.getElementsByTagName('section').toArray();
  slides.current = 0;
  slides.hasNext = function() { return this.current < slides.length-1 }
  slides.hasPrevious = function() { return this.current }
  
  slides[0].addClass('current');
  slides[1].addClass('next');

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

  document.addEventListener('keyup', function(event) {
    if(config.keys.next.contains(event.keyCode)) {
      nextSlide();
      return false;
    }
    if(config.keys.previous.contains(event.keyCode)) {
      previousSlide();
      return false;
    }
  });
});
