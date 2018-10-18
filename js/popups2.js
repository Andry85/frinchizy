$(document).ready(function () {
    $(document).on('click', '.openmodal', function (e) {
        e.preventDefault();
        $('body').addClass('noscroll');
        var id = $(this).attr('data-modal');
        $('#' + id).fadeIn();
    });

    $(document).on('click', '.closebut', function () {
        $(this).parents('.popupblock').fadeOut();
        $('body').removeClass('noscroll');
    });

    $(document).on('click', '.popupblock', function (e) {
        if ($(e.target).closest('.wrap').length == 0) {
            $(this).fadeOut();
            $('body').removeClass('noscroll');
            myMap.balloon.close();
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            $('.popupblock').fadeOut();
            $('body').removeClass('noscroll');
            myMap.balloon.close();
        }
    });

    owlcount = function () {
        if ($('.reviewsslider .owl-dots div').length > 1) {
            var count = $('.reviewsslider .owl-dots div').length;
            var val = $('.reviewsslider .owl-dots div.active').index();
            $('#owlnumber').text((val + 1) + ' / ' + count);
        }
    }

});