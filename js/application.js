    function dec(elem) {
        var elem = $(elem);
        var c = parseInt( elem.text() );
        var Form = (elem && elem.attr('rel')) ? elem.attr('rel').split(';') : ['', '', ''];
        var mod100 = c % 100;
        var F = function() {
            switch (c % 10) {
                case 1:
                    if (mod100 == 11) {
                        return Form[2];
                    }
                    else {
                        return Form[0];
                    }
                case 2:
                case 3:
                case 4:
                    if ((mod100 > 10) && (mod100 < 20)) {
                        return Form[2];
                    }
                    else {
                        return Form[1];
                    }
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 0:
                    return Form[2];
            }
        };
        elem.html(c + ' ' + F());
    }

        var loadCart = function(data){
            var CartBlock = $("#Cart");
            var MobileCartBlock = $(".cart");
            var BasketTotal = $("#BasketTotal");

			$(document).trigger('Load-dopitems-info');
			$('.closebut').click();

            var app = function(data){
                $('.CartTotal').html(data.sum);
                $('.aCartTotal').html(data.asum);
                CartBlock.find('.count').html(data.count);
                CartBlock.find('.sum').html(data.sum);
                BasketTotal.html(data.sum);
                MobileCartBlock.find('.count').html(data.count);
                if(data && data.count > 0) {
                    $('.CartList').show();
                    // CartBlock.find('.btn').removeClass('none').show();
                } else {
                    if($('a.removeCart').length == 0) { $('.CartList').hide(); }
                    // CartBlock.find('.btn').hide();
                }
                //dec( CartBlock.find('.count') );
            };
            if(data) {
                return app(data);
            }
            $.getJSON('/tools/cart.json', app);
        };

	var faddCart = function(t, onCartAddCallback){
	    console.log(t);
            var a = !(t.type) ? $(t) : $(this);
            $.getJSON('/tools/cart.json' + (a.attr('rel') || a.attr('href')), function(data){
                var p1 = $('<span> +1</span>');
                a.append(p1); p1.fadeOut();
                loadCart(data);
                if (onCartAddCallback) {
                    onCartAddCallback();
                }
            });
            return false;
        };

	var fremoveCart = function(t, onCartRemoveCallback){
        console.log(t);
        var a = !(t.type) ? $(t) : $(this);
        var rel = a.attr('rel');
        $.getJSON( '/tools/cart.json' + a.attr('href'), function(data){
            $(rel).fadeOut(100, function(){
                $(rel).remove();
            });
            loadCart(data);
            if (onCartRemoveCallback) {
                onCartRemoveCallback();
            }
        });
        return false;
    };


!function ($) {

    $(function() {

        var $window = $(window);

        $("form.ajax").submit(function() {
            var form = $(this);
            var action = form.attr('action') || location.href;
            action = action + (action.indexOf('?') > -1 ? '&' : '?') + 'csrf=' + csrf;
            var container = form.parent();
//          var data = form.serialize();

			var data = new FormData(form[0]);

			var ufile = $('input[name="download-file"]', form);
			if (ufile.length !== 0) {
				data.append('download-file', ufile[0].files[0]);
			}
/*
			$.each($('input[name="download-file"]')[0].files, function(i, file) {
				data.append('download-file['+i+']', file);
			});
*/
            var controls = $('input, button, select', form);
            controls.attr('disabled', true);
            var success = form.attr('data-success') || null;

			$.ajax({
				type: "POST",
				url: action,
				data: data,
				processData: false,
				contentType: false,
				cache: false,
			}).done(function(response){
                switch (response) {
                    case 'ok':
                        $('.ok', container).removeClass('none').show();
                        $('.err, .warning', container).hide();
                        form.hasClass('always-visible') || form.hide();
						form.find('input[type=text]').val('');
                        eval(success);
                        break;
                    case 'err-type':
                    case 'err-size':
                        $('.err.'+response, container).removeClass('none').show();
                        $('.warning.' + response, container).removeClass('none').show();
                        $('.ok', container).hide();
                        form.show();
                        break;
					case 'err':
                    default:
                        $('.err',     container).removeClass('none').show();
                        $('.warning.' + response, container).removeClass('none').show();
                        $('.ok', container).hide();
                        form.show();
                        break;
                }
                controls.removeAttr('disabled');
			});
/*
            $.post(action, data, function(response) {
                switch (response) {
                    case 'ok':
                        $('.ok', container).removeClass('none').show();
                        $('.err, .warning', container).hide();
                        form.hasClass('always-visible') || form.hide();
			form.find('input[type=text]').val('');
                        eval(success);
                        break;
                    case 'err':
                    default:
                        $('.err',     container).removeClass('none').show();
                        $('.warning.' + response, container).removeClass('none').show();
                        $('.ok', container).hide();
                        form.show();
                        break;
                }
                controls.removeAttr('disabled');
            });
*/
            return false;
        });

        var CompareBlock = $("#Compare");
        var loadCompare = function(data){
            var app = function(data){
                CompareBlock.find('.count').html(data.count);
                if(data.count > 0) {
                    // CompareBlock.find('.btn').removeClass('none').show();
                } else {
                    // CompareBlock.find('.btn').hide();
                }
                dec( CompareBlock.find('.count') );
            };
            if(data) {
                return app(data);
            }
            $.getJSON('/tools/compare.json', app);

        };
		loadCompare();

		//loadCart();

        $('a.addCart').on('click', faddCart);

        $('a.removeCart').on('click', fremoveCart);

        $('a.addCompare').click(function(){
            var a = $(this);
            $.getJSON( '/tools/compare.json' + (a.attr('rel') || a.attr('href')), function(data){
                a.attr('href', '/compare/').html('в сравнении').unbind('click');
                loadCompare(data);
            });
            return false;
        });

        $('a.removeCompare').click(function(){
            var a = $(this);
            var rel = a.attr('rel');
            $.getJSON( '/tools/compare.json' + a.attr('href'), function(data){
                $(rel).fadeOut(1000, function(){
			$(rel).remove();
		});
                loadCompare(data);
            });
            return false;
        });

        $(document).on('blur', 'input.count', function(){
            var i = $(this);
            var price = parseFloat( i.attr('data-price') ) || 0;
            var count = parseFloat( i.val() ) || 0;
            var id = i.attr('rel');
            console.log('Item: ' + id + ' = ' + count);
            $.getJSON( '/tools/cart.json?set[' + id + '][Count]=' + count + '&_' + parseInt(new Date().getTime()/1000), function(data){
                console.log('Request: ' + '/tools/cart.json?set[' + id + '][Count]=' + count);
                loadCart(data);
            });
            var sum = price * count;
            $( '#sum' + id ).html( parseInt(sum) );
        });
        $(document).on('change', 'input.count', function (e) {
            var input = $(this),
                value = parseFloat(input.val().replace(',', '.'));
            if (input.data('count-as-integer')) {
                value = Math.round(value);
            } else {
                value = Math.round(value * 2) / 2;
                value = value.toFixed(value % 1 == 0 ? 0 : 1);
            }
            input.val(value).blur();
        });
        $(document).on('keydown', 'input.count', function (e) {
            if (e.keyCode == 13) {
                e.stopPropagation();
                e.target.blur();
                return false;
            }
        });

	$('.popupopen').click(function(){
		alert( "Привет" );
	    var GID = $(this).attr('rel');
	    var pop = $('#popup_modal_block');
	    pop.removeClass('none').show();
	    pop.find('.product_wrap').load('/catalog/adgroup/' + GID + '/');
	});

	/*$.getJSON('http://freegeoip.net/json/', function(data){
		console.log(data);
	});*/

    });

}(window.jQuery)