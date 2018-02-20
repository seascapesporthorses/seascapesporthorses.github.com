(function () {
var canvas = document.createElement('canvas');
var html = document.getElementsByTagName('html')[0];
var addClass = function (element, className) {
  if (element.className) {
    element.className += ' ' + className
  }
  else {
    element.className = className
  }
}
if (canvas.getContext && canvas.getContext('2d') && canvas.toDataURL('image/webp').indexOf('data:image/webp') == 0) {
  addClass(html, "webp");
}
else {
  addClass(html, "no-webp");
}
})();
