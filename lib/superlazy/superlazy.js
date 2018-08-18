function superlazy (options) {
  options = options || {};
  var ticking = false;
  var last_call_time = 0;
  var threshold = options.threshold || 0;
  var interval = options.interval || 0;
  var lazy_list = [];

  var buildGifDataURI = function (width, height) {
    if (!window.btoa) {
      return;
    }
    var fromCharCode = String.fromCharCode;
    var size_code = btoa(
      fromCharCode(width & 255)
    + fromCharCode(width >> 8)
    + fromCharCode(height & 255)
    + fromCharCode(height >> 8)
    + fromCharCode(0)
    + fromCharCode(0)
    );
    return "data:image/gif;base64,R0lGODlh" + size_code + "ACwAAAAAAQABAAA=";
  };

  var initialize = function () {
    var lazy_element_list = document.querySelectorAll('[data-lazyload]');
    for (var index = 0; index < lazy_element_list.length; index++) {
      var lazy_element = lazy_element_list[index];
      var width = +lazy_element.getAttribute('data-width');
      var height = +lazy_element.getAttribute('data-height');
      var filler_element;
      if (width && height) {
        filler_element = document.createElement('img');
        filler_element.setAttribute('src', buildGifDataURI(width, height));
        filler_element.setAttribute('data-lazyload', '');
        lazy_element.parentNode.replaceChild(filler_element, lazy_element);
      } else {
        filler_element = lazy_element;
      }
      lazy_list.push({element: filler_element, html_string: lazy_element.innerHTML});
    }
  };

  var isVisible = function (element) {
    var window_inner_height = window.innerHeight || document.documentElement.clientHeight;
    return element.getBoundingClientRect().top - window_inner_height <= threshold;
  };

  var checkLazy = function (scroll_pos) {
    var next_lazy_item = lazy_list[0] || {};
    var next_lazy_element = next_lazy_item.element;
    if (next_lazy_element && isVisible(next_lazy_element.parentNode, 1000)) {
      var parent_element = next_lazy_element.parentNode;
      var new_element = document.createElement('div');
      new_element.innerHTML = next_lazy_item.html_string;
      var image_element = new_element.querySelector('img');
      while (new_element.childNodes.length) {
        parent_element.insertBefore(new_element.childNodes[0], next_lazy_element);
      }
      if (image_element) {
        var last_style = image_element.getAttribute('style');
        image_element.setAttribute('style', 'display: none;');
        image_element.addEventListener('load', function (event) {
          var target = event.currentTarget;
          parent_element.removeChild(next_lazy_element);
          if (last_style) {
            target.setAttribute('style', last_style);
          } else {
            target.removeAttribute('style');
          }
        });
      } else {
        parent_element.removeChild(next_lazy_element);
      }
      lazy_list.shift();
      checkLazy();
    } else if (!next_lazy_element) {
      window.removeEventListener('scroll', scrollListener);
    }
  };

  var scrollListener = function (event) {
    if (!ticking && Date.now() - last_call_time > interval) {
      ticking = true;
      (window.requestAnimationFrame || window.setTimeout)(function() {
        checkLazy();
        last_call_time = Date.now();
        ticking = false;
      });
    }
  };

  initialize();
  checkLazy();
  window.addEventListener('scroll', scrollListener);
}
