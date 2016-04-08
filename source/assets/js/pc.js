define([], function() {

    var Tips = (function() {
        var $tipBox = $('.tips-box');

        return {
            show: function() {
                $tipBox.removeClass('hide');
            },
            hide: function() {
                $tipBox.addClass('hide');
            },
            init: function() {}
        }
    })();

    var tags = $('.tagcloud a');
    var resetTags = function() { // 处理标签颜色
        tags.css('font-size', 12).each(function(i, tag) {
            var num = tag.innerHTML.length % 5 + 1;
            tag.className = 'color' + num;
        });
    }

    var $wrap = $('.switch-wrap');
    var slide = function(idx) { // 切换面板
        $wrap.css('transform', 'translate(-' + idx * 100 + '%, 0)');
        $('.icon-wrap').addClass('hide').eq(idx).removeClass('hide');
    }

    var bind = function() { // 切换面板事件绑定
        var switchBtn = $('#myonoffswitch');
        var tagcloud = $('.second-part');
        var navDiv = $('.first-part');

        switchBtn.click(function() { // 切换按钮
            if (switchBtn.hasClass('clicked')) {
                switchBtn.removeClass('clicked');
                tagcloud.removeClass('turn-left');
                navDiv.removeClass('turn-left');
            } else {
                switchBtn.addClass('clicked');
                tagcloud.addClass('turn-left');
                navDiv.addClass('turn-left');
                resetTags();
            }
        });

        var timeout;
        var isEnterBtn = false;
        var isEnterTips = false;

        $('.icon').on('mouseenter', function() { // 表处弹层事件
            isEnterBtn = true;
            Tips.show();
        }).on('mouseleave', function() {
            isEnterBtn = false;
            setTimeout(function() {
                if (!isEnterTips) {
                    Tips.hide();
                }
            }, 100);
        }).on('click', function() {
            var length = $('.icon-wrap').length - 1;
            var idx = $('.icon-wrap:not(.hide)').data('idx');

            idx++;
            if (length < idx) {
                idx = 0;
            }

            slide(idx);
        });

        $('.tips-box').on('mouseenter', function() {
            isEnterTips = true;
            Tips.show();
        }).on('mouseleave', function() {
            isEnterTips = false;
            setTimeout(function() {
                if (!isEnterBtn) {
                    Tips.hide();
                }
            }, 100);
        });

        $('.tips-inner li').on('click', function() {
            slide($(this).index());
            Tips.hide();
        });
    };

    // 提示标签
    var $msg = $('.alertInfo').size() || $('<div class="alertInfo"></div>').appendTo('body');
    function alertInfo(msg) { // 弹层提示
        if (!msg) return;

        $msg.html(msg).css('right', -9999).animate({
            right: 20
        }, 800);

        clearTimeout(alertInfo._timer);
        alertInfo._timer = setTimeout(function() { // 3秒后制动关闭
            $msg.animate({
                right: -9999
            }, 800);
        }, 3e3);
    }

    function makeHtml(name, avatar) {
        return '<img class="alert-avatar" src="' + avatar + '">' + name + ', 欢迎回来~';
    }

    // 多说api 抄自小胡子哥博客
    function welcome() {
        if (!duoshuo) {
            return;
        }
        if (document.cookie.indexOf('visitor') < 0) {
            $.ajax({
                url: 'http://' + duoshuo + '.duoshuo.com/api/threads/listPosts.jsonp?thread_key=/&require=visitor',
                dataType: 'jsonp',
                timeout: 5000,
                success: function(data) {
                    if (!(data && data.visitor && data.visitor.name && data.visitor.avatar_url)) {
                        // getNamefailed();
                        return;
                    }
                    var name = data.visitor.name;
                    var avatar = data.visitor.avatar_url;
                    var htmlStr = makeHtml(name, avatar);
                    alertInfo(htmlStr);

                    // 目前登录人缓存半天
                    var dt = new Date();
                    dt.setTime(+dt + 216e5); // 半天
                    document.cookie = 'visitor=' + encodeURIComponent(name + '|' + avatar) + '; expires=' + dt.toUTCString() + '; path=/'
                }
            });
        }
    }

    // 离开页面事件 title 提示
    function visibilitychange() {
        var titleTime;
        var oldTitle = document.title;
        // var shortcut = document.getElementById('shortcut');

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                document.title = '(●—●)咦，去哪儿啊？';
                clearTimeout(titleTime);
                // shortcut.href = 'images/fail.ico';
            } else {
                document.title = '(/≧▽≦/)欢迎回来！ - ' + oldTitle;
                // shortcut.href = 'images/favicon.ico';
                titleTime = setTimeout(function() {
                    document.title = oldTitle;
                }, 2e3);
            }
        })
    }

    // 2倍图 处理
    function srcset() {
        $('.article-entry img').each(function(i, el) {
            if (el.src.indexOf('@2x') > 0) {
                $(el).replaceWith($('<img>', {src: el.src, srcset: el.src + ' 2x' }));
            }
        });
    }


    return {
        init: function() {
            resetTags();
            bind();
            Tips.init();

            visibilitychange();
            // srcset();
            welcome();
        }
    }
});