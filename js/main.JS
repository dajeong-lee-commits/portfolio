
$(function () {
    $('.tab_menu li button').on('click', function (e) {
        e.preventDefault();

        // 클릭한 버튼이 몇 번째 li인지
        const index = $(this).parent().index();

        // 메뉴 active 처리
        $('.tab_menu li').removeClass('active');
        $(this).parent().addClass('active');

        // 내용 active 처리
        $('.section-02 .contents .tab_list').removeClass('active');
        $('.section-02 .contents .tab_list').eq(index).addClass('active');
    });

    const headerHeight = $('#header').outerHeight();

    $('#header .gnb .menu').on('click', function (e) {
        e.preventDefault();

        let targetSelector = '';

        if ($(this).hasClass('menu-01')) {
            targetSelector = '.main_visual';
        } else if ($(this).hasClass('menu-02')) {
            targetSelector = '.section-01';
        } else if ($(this).hasClass('menu-03')) {
            targetSelector = '.section-02';
        } else if ($(this).hasClass('menu-04')) {
            targetSelector = '.section-03';
        } else if ($(this).hasClass('menu-05')) {
            targetSelector = '#footer';
        }

        // 혹시라도 매칭되는 게 없으면 중단
        if (!targetSelector) return;

        const offsetTop = $(targetSelector).offset().top;

        $('html, body').animate(
            {
                scrollTop: offsetTop - headerHeight // 고정 헤더 높이만큼 위로 보정
            },
            800 
        );
    });

});
