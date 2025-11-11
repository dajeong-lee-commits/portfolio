/* 
window.onload = () => {


}; */

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
});
