require([], function() {

    var isMobileInit = false;
    var loadMobile = function() {
        if (isMobileInit) { return; }

        require([qiniu + 'assets/js/mobile.js'], function(mobile) {
            mobile.init();
            isMobileInit = true;
        });
    };

    var isPCInit = false;
    var loadPC = function() {
        if (isPCInit) { return; }

        require([qiniu + 'assets/js/pc.js'], function(pc) {
            pc.init();
            isPCInit = true;
            require([qiniu + 'assets/js/console.helper.js']); // 控制台脚本延后加载
        });
    };

    var browser = {
        versions: function() {
            var u = window.navigator.userAgent;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
                iPad: u.indexOf('iPad') > -1, //是否为iPad
                webApp: u.indexOf('Safari') == -1, //是否为web应用程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') == -1 //是否为微信浏览器
            };
        }()
    };

    $(window).on('resize', function() {
        if (isMobileInit && isPCInit) {
            $(window).off('resize');
            return;
        }

        var w = $(window).width();
        if (w >= 700) {
            loadPC();
        } else {
            loadMobile();
        }
    });

    if (browser.versions.mobile === true || $(window).width() < 700) {
        loadMobile();
    } else {
        loadPC();
    }

    // 是否使用fancybox
    if (yiliaConfig.fancybox === true) {
        require([qiniu + 'assets/fancybox/jquery.fancybox.js'], function(pc) {
            if ($(".isFancy").length !== 0) {
                $('.article-inner img').wrap(function() {
                    return '<a href="' + this.src + '" title="' + this.alt + '" rel="fancy-group" class="fancy-ctn fancybox"/>';
                });
                $('.article-inner .fancy-ctn').fancybox();
            }
        });
    }

    // 是否开启动画
    if (yiliaConfig.animate === true) {
        require([qiniu + 'assets/js/jquery.lazyload.js'], function() {
            var $avatar = $('.js-avatar');
            $avatar.prop('src', $avatar.attr('lazy-src'));
            $avatar.load(function() {
                $avatar.addClass('show');
            });
        });

        if (yiliaConfig.isHome === true) {
            $(window).on('scroll', function() {
                $('.article').each(function() {
                    if ($(this).offset().top <= $(window).scrollTop() + $(window).height() && !($(this).hasClass('show'))) {
                        $(this).removeClass('hidden').addClass('show is-hiddened');
                    } else {
                        if (!$(this).hasClass("is-hiddened")) {
                            $(this).addClass("hidden");
                        }
                    }
                });
            }).trigger('scroll');
        }

    }

    // 是否新窗口打开链接
    if (yiliaConfig.open_in_new == true) {
        $(".article a[href]").attr("target", "_blank")
    }
});
