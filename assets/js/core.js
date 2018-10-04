var filter = [];
var category_id;
var url = document.location.origin + '/filters';
$('#submit_filters').on('click', function () {
    submitFilters();
});

function submitFilters() {
    var countFilter = $('.product-form__body .product-form__item').length;
    for (var i = 0; i < countFilter; i++) {
        id = $('.product-form__item').eq(i).find('.filter_name').attr('filter_id');
        countSelectFilter = $('.product-form__item').eq(i).find('.lighted').length;
        parentFilter = $('.m-catalog__left-check-block').eq(i).children('.lighted');
        option = $('.product-form__item').eq(i).find('.product-form__select').val();
        if (option != 'all') {
            filter.push({
                id,
                option
            });
        }
    }
    category_id = $('.category_id').attr('category_id');
    page = $('.category_id').attr('page');
    sendDataPartial(filter, category_id, page);
}

function sendDataPartial(f, id, page) {
    if (f.length == 0) {
        f = 101;
    }
    $.ajax({
        method: 'POST',
        url: url,
        data: {
            "data": f,
            "id": id,
            "page": page
        },
        cache: false,
        beforeSend: function () {
            preloaderShow();
        },
        success: function (x) {
            preloaderHide();
            $('.paste-ajax').html(x);
        }
    });
}

function preloaderShow() {
    var selector = '#preloader';
    var si = 700;
    $(selector).attr("complite", "false");
    setTimeout(function () {
        if ($(selector).attr("complite") === "false") {
            $(selector).fadeIn(300);
            $('body').css('cursor', 'wait');
        }
    }, si);
}

function preloaderHide() {
    var selector = '#preloader';
    $(selector).attr("complite", "true");
    $(selector).hide();
    $('body').css('cursor', 'default');
}

function sendPage(page) {
    $('.category_id').attr('page', page);
    $('#submit_filters').click();
}
