/**
 *   Unslider by @idiot and @damirfoy
 *   Contributors:
 *   - @ShamoX
 *
 */

(function ($, f) {
  var Unslider = function () {
    //  Set some options
    this.o = {
      speed: 500,     // animation speed, false for no transition (integer or boolean) 动画切换速度
      delay: 3000,    // delay between slides, false for no autoplay (integer or boolean) 自动播放幻灯片的延迟时间
      init: 0,        // init delay, false for no delay (integer or boolean) 开始自动播放slider的等待时间
      pause: !f,      // pause on hover (boolean) 是否鼠标移上暂停
      loop: !f,       // infinitely looping (boolean) 循环切换
      keys: f,        // keyboard shortcuts (boolean) 使用键盘左右键切换
      dots: f,        // display dots pagination (boolean) 是否显示分页点
      arrows: f,      // display prev/next arrows (boolean) 是否显示左右切换箭头
      thumb: f,       // 是否具备缩略图功能
      starting: f,    // invoke before animation (function with argument) 执行幻灯片切换前的动画
      complete: f,    // invoke after animation (function with argument) 执行幻灯片切换后的动画
      easing: 'swing', // easing function to use for animation 自定义动画擦除效果
      autoplay: true,  // enable autoplay on initialisation  自动播放幻灯片
      moveUnit: 1,        // 设置一次移动的位移。 “1”表示移动一个item的宽度。


      // 设置主元素的宽和高 todo
      width: f,
      height: f,

      // html className
      CLASS_ITEMS: 'items',   // slides container selector
      CLASS_ITEM: 'items .item',    // slidable items selector
      CLASS_DOTS: 'dots',  // 控制点
      CLASS_DOT: 'dot',
      CLASS_ARROWS: 'arrows',  // 控制箭头
      CLASS_ARROW: 'arrow',
      CLASS_PREV: 'prev',  // 控制箭头的左右方向
      CLASS_NEXT: 'next',
      CLASS_THUMBS: 'thumbs', // 缩略图
      CLASS_THUMB: 'thumb'
    };
  }

  Unslider.prototype.init = function (el, o) {
    var _ = this;
    _.el = el;

    //  Check whether we're passing any options in to plugin
    var o = _.o = $.extend(_.o, o);


    _.location = 0; //  Current indeed
    // 初始化移动次数（移动一个item宽度需要的次数为：1/moveUnit）
    _.step = 0;

    var ul = _.ul = el.find("." + o.CLASS_ITEMS);
    // 这里兼容以li标签作为一个item的老版本
    var tempLis = el.find("." + o.CLASS_ITEM);
    tempLis = tempLis.length <= 0 ? el.find("." + o.CLASS_ITEMS + ' li') : tempLis;
    var li = _.li = tempLis;
    var len = _.len = li.length;

    //  Set the relative widths
    ul.width((len * 100) + '%');
    li.width((100 / len) + '%');

    // 初始化缩略图逻辑：判断是否有缩略图，有就初始化缩略图高度。
    _.thumbs_height = o.thumb ? el.find('.' + o.CLASS_THUMBS).outerHeight() : 0;

    // debugger;
    //  初始化容器高度
    el.css({height: li.first().outerHeight() + _.thumbs_height});

    //  Autoslide
    // autoplay、delay、pause 具有父子逻辑关系
    o.autoplay && setTimeout(function () {
      if (o.delay | 0) {
        _.play();

        if (o.pause) {
          el.on('mouseover mouseout', function (e) {
            _.stop();
            e.type === 'mouseout' && _.play();
          });
        }
      }
    }, o.init | 0);

    //  Keypresses
    if (o.keys) {
      $(document).keydown(function (e) {
        switch (e.which) {
          case 37:
            _.prev(); // Left
            break;
          case 39:
            _.next(); // Right
            break;
          case 27:
            _.stop(); // Esc
            break;
        }
      });
    }

    //  Dot pagination
    o.dots && _.control(o.CLASS_DOT);

    //  Arrows support
    o.arrows && _.control(o.CLASS_ARROW);

    //  thumbs support
    o.arrows && _.control(o.CLASS_THUMB);

    //  Move support
    if ($.event.special['move'] || $.Event('move')) {
      el.on('movestart', function (e) {
        if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
          e.preventDefault();
        } else {
          el.data("left", _.ul.offset().left / el.width() * 100);
        }
      }).on('move', function (e) {
        var left = 100 * e.distX / el.width();
        var leftDelta = 100 * e.deltaX / el.width();
        _.ul[0].style.left = parseInt(_.ul[0].style.left.replace("%", "")) + leftDelta + "%";

        _.ul.data("left", left);
      }).on('moveend', function (e) {
        var left = _.ul.data("left");
        if (Math.abs(left) > 30) {
          var i = left > 0 ? _.location - 1 : _.location + 1;
          if (i < 0 || i >= len) i = _.location;
          _.to(i);
        } else {
          _.to(_.location);
        }
      });
    }

    return _;
  }
  //  移动到相应的位置
  Unslider.prototype.to = function (location, callback) {
    var _ = this,
        o = _.o,
        el = _.el,
        ul = _.ul,
        li = _.li;

    if (_.t) {
      _.stop();
      _.play();
    }

    //  To slide or not to slide
    if ((location >= _.len || location < 0) && _.o.loop === f) return;

    //  Check if it's out of bounds
    if (Math.ceil(location) >= _.len) {
      location = 0;
      _.step = 0;
    }
    if (location < 0) {
      location = _.len - 1;
      _.step = 1 / o.moveUnit * (_.len - 1);
    }


    var current =
            _.location,
        target = li.eq(Math.floor(_.step / (1 / o.moveUnit)));

    $.isFunction(o.starting) && !callback && o.starting(el, li.eq(current));

    var speed = callback ? 5 : o.speed | 0,
        easing = o.easing,
        ulObj = { height: target.outerHeight() },
        elObj = { height: target.outerHeight() + _.thumbs_height };

    if (!ul.queue('fx').length) {
      //  Handle those pesky dots
      el.find("." + _.o.CLASS_DOT).eq(Math.floor(_.step / (1 / o.moveUnit))).
          addClass('active').siblings().removeClass('active');
      el.animate(elObj, speed, easing) &&
      ul.animate(
          $.extend({left: '-' + location * 100 + '%'}, ulObj),
          speed,
          easing,
          function (data) {
            _.location = location;

            $.isFunction(o.complete) && !callback && o.complete(el, target);
          });
    }
  }
  //  Autoplay functionality
  Unslider.prototype.play = function () {
    var _ = this;
    _.t = setInterval(function () {
      _.to(_.location + _.o.moveUnit);
    }, _.o.delay | 0);
  }
  //  Stop autoplay
  Unslider.prototype.stop = function () {
    var _ = this;
    _.t = clearInterval(_.t);
    return _;
  }

  //  Move to previous/next slide
  Unslider.prototype.next = function () {
    var _ = this;
    _.step++;
    return _.stop().to(_.location + _.o.moveUnit);

  }
  Unslider.prototype.prev = function () {
    var _ = this;
    _.step--;
    return _.stop().to(_.location - _.o.moveUnit);

  }
  //  Create dots and arrows
  Unslider.prototype.control = function (name) {
    var _ = this;
    var createEl = function(elBoxClass, elClass) {
      var elBox = _.el.find("." + elBoxClass);
      var el = _.el.find("." + elClass).eq(0).clone();
      elBox.empty();
      $.each(_.li, function (index) {
        elBox.append(el.clone().addClass(index === _.location ? "active" : ""));
      });
    };

    if(name === _.o.CLASS_THUMB) {
      createEl(_.o.CLASS_THUMBS, name);
      // 将所有的 .thumb 加入到新建的 .thumbs-roll-box 中。又将 .thumbs-roll-box 添加到 .thumbs中
      var thumbs_box = $(document.createElement('div')).addClass('thumbs-roll-box');
      _.el.find('.' + _.o.CLASS_THUMB).wrapAll(thumbs_box);
      _.el.find('.' + _.o.CLASS_THUMBS).append(thumbs_box);
    }
    (name === _.o.CLASS_DOT) && createEl(_.o.CLASS_DOTS, name);

    _.el.find("." + name).click(function () {
      var me = $(this);
      if (me.hasClass(_.o.CLASS_DOT)) {
        _.step = me.index() * (1 / _.o.moveUnit);
        _.stop().to(me.index());
      } else {
        me.hasClass(_.o.CLASS_PREV) ? _.prev() : _.next();
      }


    });
  }

  //  Create a jQuery plugin
  $.fn.unslider = function (o) {
    var len = this.length;

    //  Enable multiple-slider support
    return this.each(function (index) {
      //  Cache a copy of $(this), so it
      var me = $(this),
          key = 'unslider' + (len > 1 ? '-' + ++index : ''),
          instance = (new Unslider()).init(me, o);

      //  Invoke an Unslider instance
      me.data(key, instance).data('key', key);
    });
  };

  Unslider.version = "1.0.0";
})(jQuery, false);
