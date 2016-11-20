module.exports = function(options) {
  options || (options = {});

  if (options.performance === true) {
    if (!window.performance) {
      window.performance = {};
    }

    if (!performance.now) {
      if (performance.webkitNow) {
        performance.now = function() {
          return performance.webkitNow();
        };
      } else {
        performance.now = function() {
          return Date.now();
        };
      }
    }
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame;
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame =
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.oCancelAnimationFrame;
  }

  if (!window.CustomEvent) {
    var defaultCustomEventParams = {
      bubbles: true,
      cancelable: true,
      detail: void 0
    };

    window.CustomEvent = function(type, params) {
      var event = document.createEvent('CustomEvent');

      params || (params = defaultCustomEventParams);
      event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);

      return event;
    };
  }

  if (typeof window.devicePixelRatio !== 'number') {
    Object.defineProperty(window, 'devicePixelRatio', {
      enumerable: true,
      configurable: true,

      get: function() {
        return (
          window.webkitDevicePixelRatio ||
          window.mozDevicePixelRatio ||
          window.msDevicePixelRatio || 1
        );
      }
    });
  }

  var tmpElem = document.createElement('div');
  var tmpFragment = document.createDocumentFragment();

  if (!('remove' in tmpElem)) {
    Object.defineProperty(Element.prototype, 'remove', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: function remove() {
        var parent = this.parentNode;

        if (parent) {
          parent.removeChild(this);
        }
      }
    });
  }

  if (!('hidden' in tmpElem)) {
    Object.defineProperty(window.Element.prototype, 'hidden', {
      set: function(val) {
        val = !!val;

        if (val) {
          this.setAttribute('hidden', '');
        } else {
          this.removeAttribute('hidden');
        }
      },
      get: function() {
        return this.hasAttribute('hidden');
      },
      enumerable: false,
      configurable: true
    });

    var style = document.createElement('style');
    style.innerHTML = '[hidden] { display: none; }';
    document.querySelector('head').appendChild(style);
  }

  if (!('firstElementChild' in tmpFragment)) {
    Object.defineProperties(window.DocumentFragment.prototype, {
      firstElementChild: {
        get: function() {
          var childNodes = this.childNodes;

          for (var i = 0, len = childNodes.length; i < len; i++) {
            var node = childNodes[i];

            if (node.nodeType === Node.ELEMENT_NODE) {
              return node;
            }
          }

          return null;
        },
        set: function() {}
      },
      lastElementChild: {
        get: function() {
          var childNodes = this.childNodes;

          for (var i = childNodes.length; i--;) {
            var node = childNodes[i];

            if (node.nodeType === Node.ELEMENT_NODE) {
              return node;
            }
          }

          return null;
        },
        set: function() {}
      }
    });
  }

  tmpElem = null;

  if (options.arrayBufferApply === true) {
    if (window.Uint8Array) {
      try {
        (function(){}).apply(null, new Uint8Array())
      } catch (e) {
        (function() {
          var apply = Function.apply;

          Function.prototype.apply = function(_this, args) {
            if (args && ('BYTES_PER_ELEMENT' in args)) {
              args = [].slice.call(args);
            }

            return apply.call(this, _this, args);
          };
        })();
      }
    }
  }
}