Design Notes
============

* Each slide is a HTML5 ``section`` node.
* All slides are hidden using ``display: none`` except for the current,
  previous and upcoming slides (so that an animated transition is possible).
* Slide states are applied only using CSS classes (`current`, `previous`, `next`
  and none for hidden slides).
* On navigation, these classes are interchanged, triggering CSS3 animated transitions.
