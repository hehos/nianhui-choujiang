/**
 * Created by hehui on 2016/10/11.
 */
$(function () {
    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
        var commentInput = $('.comment-base .comment-input');
        var commentTextarea = $('.comment-base .comment-textarea');
        var mask = mui.createMask();
        commentInput.addClass('ismobile');
        commentTextarea.hide().addClass('ismobile');
        $('body').css('paddingBottom', commentInput.outerHeight());
        commentInput.find('input').click(function () {
            commentInput.hide();
            mask.show();
            commentTextarea.show();
        });
        commentTextarea.find('#submit').click(function () {
            mask.close();
            commentTextarea.hide();
            commentInput.show();
        });
        mask[0].addEventListener('tap', function() {
            commentTextarea.hide();
            commentInput.show();
        });
    } else {
        $('.comment-wrap .comment-input').hide();
    }
});