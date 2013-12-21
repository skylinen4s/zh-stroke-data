// Generated by LiveScript 1.2.0
(function(){
  var SpriteStroker, x$, ref$;
  SpriteStroker = (function(){
    SpriteStroker.displayName = 'SpriteStroker';
    var prototype = SpriteStroker.prototype, constructor = SpriteStroker;
    SpriteStroker.loaders = {
      xml: zhStrokeData.loaders.XML,
      json: zhStrokeData.loaders.JSON,
      bin: zhStrokeData.loaders.Binary
    };
    function SpriteStroker(str, options){
      var res$, i$, ref$, len$, ch, p, this$ = this;
      this.play = bind$(this, 'play', prototype);
      this.options = $.extend({
        autoplay: false,
        width: 215,
        height: 215,
        loop: false,
        preload: 4,
        poster: '',
        url: './json/',
        dataType: 'json',
        speed: 1000,
        strokeDelay: 0.2,
        charDelay: 0.4
      }, options);
      this.loop = this.options.loop;
      this.preload = this.options.preload;
      this.width = this.options.width;
      this.height = this.options.height;
      this.posters = this.options.posters;
      this.url = this.options.url;
      this.dataType = this.options.dataType;
      this.speed = this.options.speed;
      this.strokeDelay = this.options.strokeDelay;
      this.charDelay = this.options.charDelay;
      this.domElement = document.createElement('canvas');
      this.domElement.width = this.options.width;
      this.domElement.height = this.options.height;
      res$ = [];
      for (i$ = 0, len$ = (ref$ = str.sortSurrogates()).length; i$ < len$; ++i$) {
        ch = ref$[i$];
        res$.push(constructor.loaders[this.dataType](this.url + "" + ch.codePointAt().toString(16) + "." + this.dataType));
      }
      this.promises = res$;
      p = this.promises[0];
      p.then(function(it){
        var strokes, i, data, empty, x$;
        strokes = [];
        for (i in it) {
          data = it[i];
          strokes.push(new zhStrokeData.Stroke(data));
          if (+i === it.length - 1) {
            continue;
          }
          empty = new zhStrokeData.Empty;
          empty.length = this$.options.speed * this$.options.strokeDelay;
          strokes.push(empty);
        }
        x$ = this$.sprite = new zhStrokeData.Comp(strokes);
        x$.scaleX = this$.options.width / 2150;
        x$.scaleY = this$.options.height / 2150;
        return x$;
      });
    }
    prototype.videoTracks = 1;
    prototype.autoplay = false;
    prototype.buffered = null;
    prototype.currentTime = 0;
    prototype.defaultPlaybackRate = 1.0;
    prototype.PlaybackRate = 1.0;
    prototype.duration = 0;
    prototype.ended = false;
    prototype.error = null;
    prototype.loop = false;
    prototype.paused = false;
    prototype.played = false;
    prototype.preload = 4;
    prototype.seekable = null;
    prototype.seeking = false;
    prototype.canPlayType = function(str){
      return 'probably' || 'maybe' || '';
    };
    prototype.fastSeek = function(time){
      this.currentTime = time;
    };
    prototype.load = function(){};
    prototype.pause = function(){};
    prototype.play = function(){
      var totalTime;
      if (this.sprite) {
        totalTime = this.sprite.length / this.options.speed;
        this.sprite.time = this.currentTime > totalTime
          ? 1
          : this.currentTime / totalTime;
        this.sprite.render(this.domElement);
      }
      this.currentTime += 1 / 60;
      if (!this.paused) {
        requestAnimationFrame(this.play);
      }
    };
    prototype.width = 0;
    prototype.height = 0;
    prototype.videoWidth = 0;
    prototype.videoHeight = 0;
    prototype.poster = 0;
    return SpriteStroker;
  }());
  x$ = (ref$ = window.zhStrokeData) != null
    ? ref$
    : window.zhStrokeData = {};
  x$.SpriteStroker = SpriteStroker;
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
