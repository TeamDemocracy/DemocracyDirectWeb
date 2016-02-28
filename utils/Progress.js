Progress = (function() {
  var RENDER_FREQ = 1000; // Milliseconds

  function Progress(target) {
    target = target || 0;
    this.reset(target);
  }

  Progress.prototype = {
    reset: reset,
    tick: tick,
    done: done,
  }

  return Progress;

  ////////////////

  function reset(target) {
    this.begin = Date.now();
    this.target = target;
    this.lastRender = 0;
  }

  function tick(i) {
    var now = Date.now();

    if (now - this.lastRender >= RENDER_FREQ) {
      render.call(this, i, now);
      this.lastRender = now;
    }
  }

  function done(i) {
    var now = Date.now();
    render.call(this, i, now);
  }

  // ===== Private =====

  function render(i, now) {
    var progress = Math.floor(10000 * i / this.target) / 100;
    var elapsed = now - this.begin;

    console.log(ljust(i + ' / ' + this.target, 16) + ljust(progress + '%') + ljust(millisecondsToString(elapsed)));
  }

  function ljust(str, width) {
    str = str.toString();
    width = width || 10;
    while (str.length < width) {
      str += ' ';
    }
    return str;
  }

  function millisecondsToString(milliseconds: number) {
    var hours = Math.floor(milliseconds / 1000 / 60 / 60);
    var minutes = Math.floor(milliseconds / 1000 / 60) - hours * 60;
    var seconds = Math.floor(milliseconds / 1000) - (hours * 60 + minutes) * 60;
    return hours + 'h ' + minutes + 'm ' + seconds + 's';
  }
})();
