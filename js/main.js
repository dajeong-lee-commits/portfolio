$(function () {
    $(window).on('scroll', function () {
        /* console.log($(window).scrollTop()); */
        if ($(window).scrollTop() > 500) {
            $('header').addClass('active');
        } else {
            $('header').removeClass('active');
        }
    });//헤더 배경 나타나기

    $('#header .inner .menu_btn').on('click', function () {
        $('#header .nav.mobile').addClass('active');
    });

    $('#header .inner .nav.mobile .close_btn').on('click', function () {
        $('#header .nav.mobile').removeClass('active');
    });//모바일 화면 아이콘 생성



    const $tabItems = $('.tab_menu li');
    const $tabButtons = $tabItems.find('button');
    const $panels = $('.section-02 .tab_list');

    $tabButtons.on('click', function (e) {
        e.preventDefault();

        const $li = $(this).closest('li');
        const index = $li.index();

        // 탭 활성화 처리
        $tabItems.removeClass('active');
        $li.addClass('active');

        // 패널 활성화 처리
        $panels.removeClass('active').attr('hidden', true);
        $panels.eq(index).addClass('active').removeAttr('hidden');

        // 🔥 탭 클릭 시 section-02 맨 위로 스크롤 (헤더 높이만큼 보정)
        const sectionTop = $('.section-02').offset().top - getHeaderH();
        $('html, body').stop(true).animate({ scrollTop: sectionTop }, 100);
    });

    const $tabMenu = $('.section-02 .tab_menu');
    const $bg = $('.section-02 .bg');
    const headerH = $('#header').outerHeight();      // fixed header 높이(70px)

    let stickPoint = 0;
    const adjust = 0; // ★ 여기서 미세 조정 (+면 더 아래에서, -면 더 위에서)

    // tab_menu가 sticky 되기 시작하는 스크롤 지점 계산
    function calcStickPoint() {
        // tab_menu의 문서 기준 Y좌표 - top(=header 높이)
        stickPoint = $tabMenu.offset().top - headerH;
    }

    // 처음 1번 계산
    $(window).on('load', calcStickPoint);
    // 리사이즈나 레이아웃 변경 시에도 다시 계산
    $(window).on('resize', calcStickPoint);

    // 스크롤 할 때마다 체크
    $(window).on('scroll', function () {
        const scrollTop = $(this).scrollTop();

        if (scrollTop >= stickPoint + adjust) {
            $bg.addClass('active');   // tab_menu가 sticky로 고정되기 시작한 이후
        } else {
            $bg.removeClass('active'); // 원래 자리로 돌아왔을 때
        }
    });//section-02 탭메뉴 배경




    const getHeaderH = () => $('#header').outerHeight() || 0;

    $('#header .nav .gnb').on('click', '.menu', function (e) {
        e.preventDefault();

        const map = {
            'menu-01': '.main_visual',
            'menu-02': '.section-01',
            'menu-03': '.section-02 .inner',
            'menu-04': '.section-03',
            'menu-05': '#footer'
        };

        const cls = this.className.split(' ').find(c => /^menu-\d+/.test(c));
        const targetSelector = map[cls];
        if (!targetSelector || !$(targetSelector).length) return;

        const top = $(targetSelector).offset().top - getHeaderH();
        $('html, body').stop(true).animate({ scrollTop: top }, 800);
    });//헤더 네비 스크롤


    const $lightbox = $("<div class='lightbox' role='dialog' aria-modal='true' hidden></div>");
    const $img = $("<img alt=''>");
    const $caption = $("<p class='caption' aria-live='polite'></p>");
    const $close = $("<button type='button' class='lightbox-close' aria-label='Close'>&times;</button>");

    $lightbox.append($close, $img, $caption).appendTo('body');

    function openLightbox(src, cap) {
        $img.attr('src', src);
        $caption.text(cap || '');
        $lightbox.fadeIn('fast').removeAttr('hidden');
        $('body').addClass('no-scroll');
        $close.focus();
    }
    function closeLightbox() {
        $lightbox.fadeOut('fast', function () {
            $lightbox.attr('hidden', true);
            $('body').removeClass('no-scroll');
        });
    }

    // 이미지 클릭(위임) → 열기
    $(document).on('click', '.lightbox-gallery img', function (e) {
        e.preventDefault();
        const src = $(this).attr('data-image-hd') || this.src;
        const cap = $(this).attr('alt') || '';
        openLightbox(src, cap);
    });

    // 오버레이 빈 영역 클릭 시 닫기 (한 번만 바인딩)
    $lightbox.on('click', function (e) {
        if (e.target === this) closeLightbox();
    });
    $close.on('click', closeLightbox);
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });//section-03 갤러리 효과
});

/* https://codepen.io/VoXelo/pen/vEEPErJ 코드펜 소스1 */
