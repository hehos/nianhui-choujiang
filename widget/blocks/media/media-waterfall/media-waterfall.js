/**
 * 瀑布流插件
 *
 * 注：1，懒加载是模拟，不是真实的懒加载。
 *    2，animation，initNum 参数现在懒加载模式下启用。
 *
  */

(function($, f) {
    var Waterfall = function() {
        this.o = {
            cols: 4,            // 列数
            lazy: f,            // 模拟懒加载
            initNum: 15,        // 懒加载方式的初始化数量
            animation: null,    // 懒加载时的动画

            // html className
            CLASSNAME_ITEM: 'media-item',
            CLASSNAME_GROUP: 'items-group',
            CLASSNAME_COLS_PREFIX: 'media-col'
        }
    }

    Waterfall.prototype = {
        init: function(el, o) {
            var _ = this;
            var tempEl = _.el = el;

            // 检测传入的参数
            if(o) {
                if(o.cols && (o.cols < 2 || isNaN(parseInt(o.cols)))) {
                    o.cols = _.o.cols;
                    alert("cols参数值非法！已设为默认值");
                }
                if(o.initNum && (o.initNum < _.o.cols || isNaN(parseInt(o.initNum)))) {
                    o.initNum = _.o.initNum;
                    alert("initNum参数值非法！已设为默认值");
                }
            }

            //  Check whether we're passing any options in to plugin
            var o = _.o = $.extend(_.o, o);

            var itemsGroup = _.itemsGroup = [];
            var items = el.find('.' + o.CLASSNAME_ITEM).length != 0 ?
                el.find('.' + o.CLASSNAME_ITEM) : el.find("li");

            //  创建一个新的dom，并将原来的dom属性copy给新dom，最后重新指向新dom
            var newObj = $('<div>').addClass(el.attr("class"));
            el.after(newObj)
            _.el = el = newObj;

            // 根据列数添加相应的className
            // 不处理的情况： 1， 列数位2的情况，因为样式默认是2列。
            //              2， 手动或者其他方式已经设置了列数
            el.addClass(o.CLASSNAME_COLS_PREFIX + o.cols);
            for(var i = 0; i < o.cols; i++) {
                itemsGroup.push($('<ul>').addClass(o.CLASSNAME_GROUP).appendTo(el));
            }

            if(o.lazy) {
                _.lazyLoad(items);
            } else {
                _.addItem(items, 0);
            }

            // 删除原来的 空 dom， ”空“是因为里面的item是都添加到新的dom中了。
            tempEl.remove();
        },
        addItem: function(items, startIdx, islazyInit) {
            var _ = this;

            var itemsGroup = _.itemsGroup;
            var endIdx = 0;

            // 计算不同加载方式时 的终止下标并从新计算初始下标
            if(_.o.lazy) {
                if(islazyInit) { // 如果是懒加载的第一次渲染dom
                    endIdx = _.o.initNum; // 如果是懒加载，第一次加载初始化数量。
                } else {
                    endIdx = startIdx + _.o.cols;
                    _.startIdx = endIdx = (endIdx <= items.length) ?endIdx : items.length;
                }
            } else {
                endIdx = $(items).length;
            }

            // 将 items 按逻辑的加入 itemsGroup 中
            for(var i = startIdx; i < endIdx; i++) {
                var am = _.o.animation;

                $(items[i]).css("visibility", "visible");
                if(am) {
                    if(typeof am == 'string') {
                        $(items[i]).fadeIn(am);
                    }
                }
                $(itemsGroup[0]).append($(items[i]));
                itemsGroup.sort(function(o1, o2) {
                    return o1.height() - o2.height();
                })
            }
        },
        lazyLoad: function(items) {
            var _ = this;

            var el = _.el;
            var elWrap = el.parent();

            // 如果初始化加载数量大于总的item数，则一次性加载完毕。
            if(_.o.initNum >= items.length) {
                _.addItem(items, 0, true);
                return;
            }
            // 懒加载的第一次加载。
            _.addItem(items, 0, true);
            // 第一次加载后，改变起始下标
            _.startIdx = _.o.initNum;
            // 下面的逻辑是处理初始化加载后的页面内容高度小于浏览器窗口高度时，页面滚动懒加载失效问题。
            while(true) {

                var clientHeight = elWrap.height();
                var oHeight = el.height();

                /*
                 * 如果页面内容高度小于浏览器窗口高度 且 起始下标小于总的item数的逻辑处理：
                 * 自动加载cols数量的item，直到oHeight > clientHeight或者
                 * 加载完所有item停止循环的自动加载。
                 * */
                if(oHeight <= clientHeight && _.startIdx < items.length) {
                    _.addItem(items, _.startIdx);
                } else {

                    /**
                     * 停止循环的两种情况。
                     * 1，加载完了所有item，那么直接终止该方法。
                     * 2，oHeight > clientHeight时，跳出循环。
                     */
                    if(_.startIdx >= items.length) {
                        return;
                    } else {
                        break;
                    }
                }
            }

            // 滚动懒加载事件
            $(elWrap).scroll(function() {
                // 滚动的条到页面顶部的偏移量(也即是容器内容顶部隐藏的高度)
                var scrollTop = elWrap.scrollTop();
                var clientHeight = elWrap.height(); // 容器高度。
                var oHeight = el.height(); // 操作dom高度
                var excessHeight = oHeight - clientHeight;
                //页面滚动最下面时在ul中添加元素
                // 加10的目的是为了防止浏览器误差（即是jq的height，scrollTop的误差问题。
                if (scrollTop + 10 >= excessHeight) {
                    _.addItem(items, _.startIdx);
                    if(_.startIdx + _.o.cols < items.length) {
                        _.startIdx += _.o.cols;
                    } else {
                        $(elWrap).off("scroll");
                    }
                }
            });
        }
    }

    //  Create a jQuery plugin
    $.fn.waterfall = function (o) {
        var len = this.length;

        //  Enable multiple-waterfall support
        return this.each(function (index) {
            //  Cache a copy of $(_), so it
            var me = $(this),
                key = 'waterfall' + (len > 1 ? '-' + ++index : ''),
                instance = (new Waterfall()).init(me, o);

            //  Invoke an Unslider instance
            me.data(key, instance).data('key', key);
        });
    };

    Waterfall.version = "1.0.0";
})(jQuery, false);


