'use strict';

window.onload = function() {
    // filter-sort 过滤排序
    $(".filter-bar .filter-sort > li").click(function() {
        $(this).siblings().removeClass("on");
        $(this).siblings().find("i").addClass("icon-arrow-up");
        $(this).siblings().find("i").removeClass("icon-arrow-down");
        if($(this).find("i").hasClass("icon-arrow-up")) {
            $(this).find("i").removeClass("icon-arrow-up");
            $(this).find("i").addClass("icon-arrow-down");
            $(this).addClass("on");
        } else {
            $(this).find("i").addClass("icon-arrow-up");
            $(this).find("i").removeClass("icon-arrow-down");
            $(this).removeClass("on");
        }
    });

    // filter-check 过滤复选框
    $(".filter-bar .filter-check > li").click(function() {
        if($(this).find("i").hasClass("icon-check-empty")) {
            $(this).find("i").removeClass("icon-check-empty");
            $(this).find("i").addClass("icon-check");
            $(this).addClass("on");
        } else {
            $(this).find("i").addClass("icon-check-empty");
            $(this).find("i").removeClass("icon-check");
            $(this).removeClass("on");
        }
    });

    // filter-select 过滤选择下拉信息。
    $(".filter-bar .filter-select > li").hover(
        function() {
            $(this).find("i").removeClass("icon-angle-down");
            $(this).find("i").addClass("icon-angle-up");
        },
        function() {
            $(this).find("i").addClass("icon-angle-down");
            $(this).find("i").removeClass("icon-angle-up")
        }
    );
    $(".filter-bar .filter-select .dropdown-opts a").click(function() {
        var toggleIco = $(this).parent(".dropdown-opts").siblings(".select-toggle").find("i");
        var selToggle = $(this).parent(".dropdown-opts").siblings(".select-toggle");
        selToggle.text($(this).text());
        selToggle.append(toggleIco);
    });

    // filter-input 过滤输入框。
    $(document).click(function() {
        $(".filter-bar .filter-input .confirm").hide();
        $(".filter-bar .filter-input").removeClass("on");
    });
    $(".filter-bar .filter-input input").click(function(event) {
        event.stopPropagation();
        $(this).parent(".filter-input").addClass("on");
        $(this).siblings(".confirm").show();
        $(this).parent(".filter-input").siblings().find(".confirm").hide();
        $(this).parent(".filter-input").siblings().removeClass("on");
    });

    // show-pattern 显示模式
    $(".filter-bar .show-pattern > li").click(function() {
        $(this).siblings().removeClass("on");
        $(this).addClass("on");
    });
};


