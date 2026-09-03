(function ($) {
    "use strict";

    // Navbar on scrolling
    $(window).scroll(function () {
        if ($('.navbar-modern').length) {
            if ($(this).scrollTop() > 40) {
                $('.navbar-modern').addClass('scrolled');
            } else {
                $('.navbar-modern').removeClass('scrolled');
            }
        } else {
            if ($(this).scrollTop() > 200) {
                $('.navbar').fadeIn('slow').css('display', 'flex');
            } else {
                $('.navbar').fadeOut('slow').css('display', 'none');
            }
        }
    });


    // Fast, responsive smooth scrolling for in-page anchor links
    $(document).on('click', 'a[href^="#"]:not([href="#"]):not([href="#0"])', function (event) {
        var hash = this.hash;
        var $target = $(hash);
        if ($target.length) {
            event.preventDefault();
            
            // Auto-collapse mobile navbar when an item is selected
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-collapse').collapse('hide');
            }
            
            var navHeight = $('.navbar-modern').outerHeight() || 68;
            var targetOffset = $target.offset().top - navHeight + 5;
            
            $('html, body').stop().animate({
                scrollTop: Math.max(0, targetOffset)
            }, 350, 'swing');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });


    // Typed Initiate for "Specialized in" with bilingual support
    var typedInstance = null;
    window.initTyped = function (lang) {
        if ($('.typed-text-output').length === 1) {
            if (typedInstance) {
                try {
                    typedInstance.destroy();
                } catch (e) {}
                typedInstance = null;
            }

            var currentLang = lang || (window.portfolioI18n ? window.portfolioI18n.getLanguage() : 'en');
            var stringsList = (currentLang === 'ja') ? [
                "フルスタックWebエンジニアリング",
                "AI・LLM連携システム開発",
                "サイバーセキュリティ基盤 (EASM & BAS)",
                "高パフォーマンス .NET & Go 開発",
                "Unity 3D & インタラクティブ開発"
            ] : [
                "Full Stack Web Engineering",
                "AI & LLM Integration",
                "Cyber Security Platforms (EASM & BAS)",
                "High-Performance .NET & Go",
                "Unity 3D & Interactive Graphics"
            ];

            typedInstance = new Typed('.typed-text-output', {
                strings: stringsList,
                typeSpeed: 45,
                backSpeed: 25,
                backDelay: 1800,
                startDelay: 300,
                contentType: null,
                smartBackspace: false,
                loop: true
            });
        }
    };

    $(document).ready(function () {
        if (!typedInstance && $('.typed-text-output').length === 1) {
            window.initTyped();
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc = '';
        $('.btn-play, .btn-play-modern').click(function () {
            $videoSrc = $(this).data("src") || '';
            // Convert to youtube-nocookie.com for better privacy and compatibility
            var embedUrl = $videoSrc;
            if (embedUrl.indexOf('youtube.com') !== -1) {
                embedUrl = embedUrl.replace('youtube.com', 'youtube-nocookie.com');
            }
            // Update fallback direct watch URL
            var directUrl = embedUrl.replace('youtube-nocookie.com/embed/', 'youtube.com/watch?v=').replace('youtube.com/embed/', 'youtube.com/watch?v=');
            $('#videoDirectLink').attr('href', directUrl);
            $videoSrc = embedUrl;
        });

        $('#videoModal').on('shown.bs.modal', function (e) {
            if (!$videoSrc) return;
            var separator = $videoSrc.indexOf('?') !== -1 ? '&' : '?';
            var originParam = (window.location.origin && window.location.origin !== 'null')
                ? '&origin=' + encodeURIComponent(window.location.origin)
                : '';
            $("#video").attr('src', $videoSrc + separator + "autoplay=1&modestbranding=1&rel=0&enablejsapi=1" + originParam);
        });

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', '');
        });
    });


    // Scroll to Bottom
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll-to-bottom').fadeOut('slow');
        } else {
            $('.scroll-to-bottom').fadeIn('slow');
        }
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li, .portfolio-filters-list .filter-btn').on('click', function () {
        $("#portfolio-flters li, .portfolio-filters-list .filter-btn").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });

    $(window).on('load', function () {
        if (portfolioIsotope) {
            portfolioIsotope.isotope('layout');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
            $('.back-to-top-modern').addClass('show');
        } else {
            $('.back-to-top').fadeOut('slow');
            $('.back-to-top-modern').removeClass('show');
        }
    });
    $('.back-to-top, .back-to-top-modern').click(function (e) {
        e.preventDefault();
        $('html, body').stop().animate({scrollTop: 0}, 350, 'swing');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        items: 1
    });
    
})(jQuery);

