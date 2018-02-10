/**
 *
 *  使用：
 *  $(".scroll-wrap").ScrollVertical();
 *  $(".scroll-wrap").ScrollVertical({height: 100 });
 *  $(".scroll-wrap").ScrollVertical({rows: 10 });
 *  $(".scroll-wrap").ScrollVertical({delay: 30 });
 *  ………………
 */


(function($, f) {
    /**
     * @constructor
     */
    var ScrollVertical = function() {
        this.o = {
            animate: 0, // 滚动的动画类型。0：连续的滚动；1：翻屏滚动
            speed: 300,    // 翻屏滚动的滚屏动画速度
            delay2: 3000, // 翻屏滚动的时间间隔
            delay: 30,  // 连续滚动速度
            rows: 8,    // 可见行数
            height: 0,  // 设置容器的高度。默认是使用可见行数来动态生成高度。
            // 默认className
            SCROLL_HEAD: '.scroll-head',            // 滚动组件的头部
            SCROLL_BOX: '.scroll-box',              // 滚动组建的容器。在非table滚动时，被组件元素本身取代。
            SCROLL_SRC_BOX: '.scroll-src-box',      // 滚动内容的原始数据。
            SCROLL_COPY_BOX: '.scroll-copy-box',    // 滚动内容的副本数据。
            CONT_ROW: '.cont-row'
        }
    }

    /**
     * @param el
     * @param o
     * @returns {ScrollVertical}
     */

    ScrollVertical.prototype.init = function(el, o) {
        var _ = this;
        _.el = el;
        // 校验用户传递
        if(o && o.hasOwnProperty('height')) {
            o.height = parseFloat(o.height); // 转换值： 10px->10或 10.5px->10.5
        }

        var o = _.o = $.extend(_.o, o);
        var delay = o.delay,
            rows = o.rows,
            height = o.height,
            scrollBox = _.scrollBox = el.find(o.SCROLL_BOX),
            scrollSrcBox = _.scrollSrcBox = el.find(o.SCROLL_SRC_BOX),
            scrollCopyBox = _.scrollCopyBox = el.find(o.SCROLL_COPY_BOX);

        var rowSelector = ""; // 行jq选择器。
        var rowEl = null;

        // 判断是否是表格
        var isTable = el.find('table').length > 0;
        if(isTable) {
            rowSelector = o.SCROLL_SRC_BOX + " tbody tr";
        } else {
            rowSelector = o.SCROLL_SRC_BOX + ' ' + o.CONT_ROW;;
        }
        rowEl = el.find(rowSelector);

        // 在一定情况下直接退出：
        /**
         * 逻辑分析：（满足其中之一退出）
         * 1，如果传参设置高度：直接比较容器高度和传参高度
         * 2，如果没有传递高度的参数：直接比较内容的行数和可见行数（rows）
         */
        if((height && el.outerHeight() < height) || (!height && rowEl.length <= rows)) return;

        // 根据是否有传参设置容器高度来计算高度。
        /**
         * 逻辑分析：
         * 1，如果传参设置高度参数：
         *      1.1，table类型：高度应该减去表格的thead部分高度。
         *      1.2，普通类型：高度即为原值，程序不做处理。
         * 2，如果没有传参设置高度参数：高度统一根据各自类型的 行高度*行数 计算。
         */
        if(height && isTable) {
            height = height - scrollSrcBox.find("thead").outerHeight();
        } else if(!height) {
            height = rowEl.first().outerHeight() * rows;
        }
        o.height = height;

        // 表格类型的 thead的th 和 tbody第一行的td宽度处理以及表头的移植。
        if(isTable) {
            // 自动让表格的thead和tbody宽度一直，达到水平自动对齐效果。
            var headThs = scrollSrcBox.find("thead th");
            var firstRowTds = scrollSrcBox.find("tbody tr").first().find("td");
            for(var i = 0; i < headThs.length; i++) {
                var width = $(headThs[i]).width();
                $(headThs[i]).width(width);
                $(firstRowTds[i]).width(width);
            }
            // 将表格的 thead 部分插入新的表格中，并清楚原表格中的t thead
            el.find(o.SCROLL_HEAD).append(scrollSrcBox.find("thead"));
            scrollSrcBox.find("thead").empty();

        } else {
            scrollBox = _.scrollBox = el;
        }

        scrollBox.css({
            height: height
        });

        // 满足条件开始滚动
        scrollCopyBox[0].innerHTML = scrollSrcBox[0].innerHTML;
        _.play();

        // 鼠标移上移出事件。
        scrollBox.on('mouseover mouseout', function (e) {
            _.stop();
            e.type === 'mouseout' && _.play();
        });

        return _;
    }

    ScrollVertical.prototype.play = function() {
        var _ = this;

        var delay = _.o.animate? _.o.delay2 : _.o.delay;
        _.t = setInterval(function() {
            _.go();
        }, delay);
    }
    ScrollVertical.prototype.stop = function() {
        this.t = clearInterval(this.t);
    }

    // 滚动的核心逻辑
    ScrollVertical.prototype.go = function() {
        var _ = this;
        var o = _.o;
        /**
         * 翻屏和滚屏动画逻辑分析：
         *  1，原理：
         *      1.1，翻屏原理：一定时间间隔循环滚动。
         *      1.2，滚屏动画原理：极短时间间隔和N次极短距离的移动，从而实现动画滚屏效果。
         *  2，相关变量解释：
         *     timeCell：滚屏的时间间隔
         *     moveCell：滚屏的单次滚动距离
         *     isRemainder：滚满一屏高度所用时间和一屏高度的余数
         *     moveCellRemainder：一屏高度和单次滚动距离的余数
         */
        var timeCell = o.speed >= o.height ?
            Math.floor(o.speed / o.height): Math.ceil(o.speed / o.height);
        var moveCell = Math.ceil(o.height / o.speed);
        var maxVal = Math.max(o.speed, o.height);
        var minVal = Math.min(o.speed, o.height);
        var isRemainder = maxVal % minVal;
        var moveCellRemainder = o.height % moveCell;

        if(o.animate) {
            var count = 0;
            var tempTimer = setInterval(function() {
                count++;
                /**
                 * 逻辑分析：
                 * 1，滚屏动画算法细节原理：
                 *     1.1，isRemainder == 0：
                 *          timeCell和moveCell对应关系：1ms<->1px,Nms<->1px,1ms<->Npx（简称整对应）
                 *     1.2，isRemainder != 0：
                 *          1.2.1，moveCellRemainder == 0：
                 *              timeCell和moveCell对应关系：整对应 + 剩余时间<->moveCell（最后一次的）
                 *          1.2.1，moveCellRemainder != 0：
                 *              timeCell和moveCell对应关系：整对应 + 剩余时间<->moveCellRemainder
                 *
                 * @type {number}
                 */
                var num = isRemainder ?
                    (moveCellRemainder ?
                    Math.floor(o.height  / moveCell) : (o.height  / moveCell) - 1) :
                    (o.height / moveCell);

                if(count >= num) {
                    clearInterval(tempTimer);
                }
                go2(moveCell);
            }, timeCell);
            setTimeout(function() {
                isRemainder && moveCellRemainder && go2(moveCellRemainder);
                isRemainder && !moveCellRemainder && go2(moveCell);
            }, o.speed);
        } else {
            go2(1);
        }
        // scrollTop：子元素滚动的顶部的隐藏高度
        // offsetTop：是元素的上外边框至包含元素的上内边框之间的像素距离
        // offsetTop不受父元素scrollTop的影响，偏移量不会变。

        function go2(moveCell) {
            _.scrollBox[0].scrollTop+=moveCell;
            if(_.scrollBox[0].scrollTop >= _.scrollCopyBox[0].offsetTop) {
                _.scrollBox[0].scrollTop = 0;
            }
        }
    }

    //  Create a jQuery plugin
    $.fn.scrollVertical = function (o) {
        var len = this.length;

        return this.each(function (index) {
            var me = $(this),
                key = 'ScrollVertical' + (len > 1 ? '-' + ++index : ''),
                instance = (new ScrollVertical).init(me, o);

            me.data(key, instance).data('key', key);
        });
    };
})(jQuery, false);

// todo ==>
// 组件在翻屏滚动情况且容器元素高度很小时：有小瑕疵，即：翻屏的动画单元距离不足1px时，
// 浏览器舍弃了小数位，导致翻一屏没有严格的一屏一屏翻的效果。