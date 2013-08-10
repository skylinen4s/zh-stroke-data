(function() {
  $(function() {
    var StrokeData, Word, demoMatrix, drawBackground, drawElementWithWord, drawElementWithWords, forEach, internalOptions, pathOutline;
    forEach = Array.prototype.forEach;
    StrokeData = void 0;
    (function() {
      var buffer, dirs, source;
      buffer = {};
      source = "xml";
      dirs = {
        "xml": "./utf8/",
        "json": "./json/"
      };
      return StrokeData = {
        source: function(val) {
          if (val === "json" || val === "xml") {
            return source = val;
          }
        },
        get: function(str, success, fail) {
          return forEach.call(str, function(c) {
            var utf8code;
            if (!buffer[c]) {
              utf8code = escape(c).replace(/%u/, "").toLowerCase();
              return WordStroker.utils.fetchStrokeJSONFromXml(dirs[source] + utf8code + "." + source, function(json) {
                buffer[c] = json;
                return typeof success === "function" ? success(json) : void 0;
              }, function(err) {
                return typeof fail === "function" ? fail(err) : void 0;
              });
            } else {
              return typeof success === "function" ? success(buffer[c]) : void 0;
            }
          });
        }
      };
    })();
    internalOptions = {
      dim: 2150,
      trackWidth: 150
    };
    demoMatrix = [1, 0, 0, 1, 100, 100];
    Word = function(options) {
      var $canvas;
      this.options = $.extend({
        scales: {
          fill: 0.4,
          style: 0.25
        },
        updatesPerStep: 10,
        delays: {
          stroke: 0.25,
          word: 0.5
        }
      }, options, internalOptions);
      this.matrix = [this.options.scales.fill, 0, 0, this.options.scales.fill, 0, 0];
      this.canvas = document.createElement("canvas");
      $canvas = $(this.canvas);
      $canvas.css("width", this.styleWidth() + "px");
      $canvas.css("height", this.styleHeight() + "px");
      this.canvas.width = this.fillWidth();
      this.canvas.height = this.fillHeight();
      return this;
    };
    Word.prototype.init = function() {
      this.currentStroke = 0;
      this.currentTrack = 0;
      return this.time = 0.0;
    };
    Word.prototype.width = function() {
      return this.options.dim;
    };
    Word.prototype.height = function() {
      return this.options.dim;
    };
    Word.prototype.fillWidth = function() {
      return this.width() * this.options.scales.fill;
    };
    Word.prototype.fillHeight = function() {
      return this.height() * this.options.scales.fill;
    };
    Word.prototype.styleWidth = function() {
      return this.fillWidth() * this.options.scales.style;
    };
    Word.prototype.styleHeight = function() {
      return this.fillHeight() * this.options.scales.style;
    };
    Word.prototype.drawBackground = function() {
      var ctx;
      ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, this.fillWidth(), this.fillHeight());
      return drawBackground(ctx, this.fillWidth());
    };
    Word.prototype.draw = function(strokeJSON) {
      var ctx,
        _this = this;
      this.init();
      this.strokes = strokeJSON;
      ctx = this.canvas.getContext("2d");
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#000";
      ctx.lineWidth = 5;
      requestAnimationFrame(function() {
        return _this.update();
      });
      return this.promise = $.Deferred();
    };
    Word.prototype.update = function() {
      var ctx, delay, i, stroke, _i, _ref,
        _this = this;
      if (this.currentStroke >= this.strokes.length) {
        return;
      }
      ctx = this.canvas.getContext("2d");
      ctx.setTransform.apply(ctx, this.matrix);
      stroke = this.strokes[this.currentStroke];
      if (this.time === 0.0) {
        this.vector = {
          x: stroke.track[this.currentTrack + 1].x - stroke.track[this.currentTrack].x,
          y: stroke.track[this.currentTrack + 1].y - stroke.track[this.currentTrack].y,
          size: stroke.track[this.currentTrack].size || this.options.trackWidth
        };
        ctx.save();
        ctx.beginPath();
        pathOutline(ctx, stroke.outline);
        ctx.clip();
      }
      for (i = _i = 1, _ref = this.options.updatesPerStep; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.time += 0.02;
        if (this.time >= 1) {
          this.time = 1;
        }
        ctx.beginPath();
        ctx.arc(stroke.track[this.currentTrack].x + this.vector.x * this.time, stroke.track[this.currentTrack].y + this.vector.y * this.time, this.vector.size * 2, 0, 2 * Math.PI);
        ctx.fill();
        if (this.time >= 1) {
          break;
        }
      }
      delay = 0;
      if (this.time >= 1.0) {
        ctx.restore();
        this.time = 0.0;
        this.currentTrack += 1;
      }
      if (this.currentTrack >= stroke.track.length - 1) {
        this.currentTrack = 0;
        this.currentStroke += 1;
        delay = this.options.delays.stroke;
      }
      if (this.currentStroke >= this.strokes.length) {
        return setTimeout(function() {
          return _this.promise.resolve();
        }, this.options.delays.word * 1000);
      } else {
        if (delay) {
          return setTimeout(function() {
            return requestAnimationFrame(function() {
              return _this.update();
            });
          }, delay * 1000);
        } else {
          return requestAnimationFrame(function() {
            return _this.update();
          });
        }
      }
    };
    drawBackground = function(ctx, dim) {
      ctx.strokeStyle = "#A33";
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, dim);
      ctx.lineTo(dim, dim);
      ctx.lineTo(dim, 0);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(0, dim / 3);
      ctx.lineTo(dim, dim / 3);
      ctx.moveTo(0, dim / 3 * 2);
      ctx.lineTo(dim, dim / 3 * 2);
      ctx.moveTo(dim / 3, 0);
      ctx.lineTo(dim / 3, dim);
      ctx.moveTo(dim / 3 * 2, 0);
      ctx.lineTo(dim / 3 * 2, dim);
      return ctx.stroke();
    };
    pathOutline = function(ctx, outline) {
      var path, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = outline.length; _i < _len; _i++) {
        path = outline[_i];
        switch (path.type) {
          case "M":
            _results.push(ctx.moveTo(path.x, path.y));
            break;
          case "L":
            _results.push(ctx.lineTo(path.x, path.y));
            break;
          case "C":
            _results.push(ctx.bezierCurveTo(path.begin.x, path.begin.y, path.mid.x, path.mid.y, path.end.x, path.end.y));
            break;
          case "Q":
            _results.push(ctx.quadraticCurveTo(path.begin.x, path.begin.y, path.end.x, path.end.y));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };
    drawElementWithWord = function(element, val, options) {
      var promise, word;
      promise = jQuery.Deferred();
      word = new Word(options);
      $(element).append(word.canvas);
      StrokeData.get(val, function(json) {
        return promise.resolve({
          drawBackground: function() {
            return word.drawBackground();
          },
          draw: function() {
            return word.draw(json);
          },
          remove: function() {
            return $(word.canvas).remove();
          }
        });
      }, function() {
        return promise.resolve({
          drawBackground: function() {
            return word.drawBackground();
          },
          draw: function() {
            var p;
            p = jQuery.Deferred();
            $(word.canvas).fadeTo("fast", 0.5, function() {
              return p.resolve();
            });
            return p;
          },
          remove: function() {
            return $(word.canvas).remove();
          }
        });
      });
      return promise;
    };
    drawElementWithWords = function(element, words, options) {
      return Array.prototype.map.call(words, function(word) {
        return drawElementWithWord(element, word, options);
      });
    };
    window.WordStroker || (window.WordStroker = {});
    return window.WordStroker.canvas = {
      StrokeData: StrokeData,
      Word: Word,
      drawElementWithWords: drawElementWithWords
    };
  });

}).call(this);

/*
//@ sourceMappingURL=draw.canvas.js.map
*/