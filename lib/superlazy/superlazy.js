function superlazy (options) {
  var options = options || {};
  var ticking = false;
  var last_call_time = 0;
  var threshold = options.threshold || 0;
  var interval = options.interval || 0;

  var isVisible = function (element) {
    var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
    return element.getBoundingClientRect().top - windowInnerHeight <= threshold;
  };

  var checkLazy = function (scroll_pos) {
    next_lazy_element = document.querySelector('[data-lazyload]');
    if (next_lazy_element && isVisible(next_lazy_element.parentNode, 1000)) {
      next_lazy_element.outerHTML = next_lazy_element.text;
      checkLazy();
    } else if (!next_lazy_element) {
      window.removeEventListener('scroll', scroll_listener)
    }
  }

  var scroll_listener = function (event) {
    if (!ticking && Date.now() - last_call_time > interval) {
      ticking = true;
      window.requestAnimationFrame(function() {
        checkLazy();
        last_call_time = Date.now();
        ticking = false;
      });
    }
  }
  window.addEventListener('scroll', scroll_listener);
  checkLazy();
}
