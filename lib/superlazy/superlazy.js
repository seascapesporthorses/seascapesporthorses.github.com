function superlazy (options) {
  var options = options || {};
  var ticking = false;
  var last_call_time = 0;
  var threshold = options.threshold || 0;
  var interval = options.interval || 0;
  window.lazy_list = [];

  var buildGifDataURI = function (width, height) {
    sizeCode = btoa(
      String.fromCharCode(width & 255)
    + String.fromCharCode(width >> 8)
    + String.fromCharCode(height & 255)
    + String.fromCharCode(height >> 8)
    + String.fromCharCode(0)
    + String.fromCharCode(0)
    );
    return "data:image/gif;base64,R0lGODlh" + sizeCode + "ACwAAAAAAQABAAA=";
  }

  var initialize = function () {
    var lazy_element_list = document.querySelectorAll('[data-lazyload]');
    for (var index = 0; index < lazy_element_list.length; index++) {
      var lazy_element = lazy_element_list[index];
      var width = parseInt(lazy_element.getAttribute('data-width'));
      var height = parseInt(lazy_element.getAttribute('data-height'));
      if (width && height) {
        var filler_element = document.createElement('img');
        filler_element.setAttribute('src', buildGifDataURI(width, height));
        filler_element.setAttribute('data-lazyload', '');
        lazy_element.parentNode.replaceChild(filler_element, lazy_element);
      } else {
        filler_element = lazy_element;
      }
      lazy_list.push({element: filler_element, html_string: lazy_element.text});
    }
  }

  var isVisible = function (element) {
    var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
    return element.getBoundingClientRect().top - windowInnerHeight <= threshold;
  };

  var checkLazy = function (scroll_pos) {
    var next_lazy_item = lazy_list[0] || {};
    var next_lazy_element = next_lazy_item.element;
    if (next_lazy_element && isVisible(next_lazy_element.parentNode, 1000)) {
      var new_element = document.createElement('div');
      new_element.innerHTML = next_lazy_item.html_string;
      var image_element = new_element.querySelector('img');
      while (new_element.childNodes.length) {
        next_lazy_element.parentNode.insertBefore(new_element.childNodes[0], next_lazy_element);
      }
      if (image_element) {
        image_element.style.setProperty('display', 'none');
        image_element.addEventListener('load', function (event) {
          next_lazy_element.parentNode.removeChild(next_lazy_element);
          event.currentTarget.style.removeProperty('display');
          if (!event.currentTarget.getAttribute('style')) {
            event.currentTarget.removeAttribute('style');
          }
        })
      } else {
        next_lazy_element.parentNode.removeChild(next_lazy_element);
      }
      lazy_list.shift();
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
  initialize();
  checkLazy();
  window.addEventListener('scroll', scroll_listener);
}
