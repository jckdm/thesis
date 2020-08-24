$(function() {
	var w = $('.content h2');
	var n = $('#nav')[0];
	for (var i = 0; i < w.length; i++) {
    var h = $(w[i]).html();
		$(w[i]).attr('id', h);
    $(n).append('<a href="#' + h + '">' + h + '</a> <br>');
	}

	$(window).scroll(function() {
		var s = $(document).scrollTop();
    var win = $(window).width();
    var w = 900 / win;
    if (win < 415) { w = w / 1.65; }

		if (s < (800 * w)) {
			$('#pic').attr('src', 'img/1.jpg');
		}
		if (s > (800 * w) && s < (1500 * w)) {
			$('#pic').attr('src', 'img/2.jpg');
		}
		if (s > (1500 * w)) {
			$('#pic').attr('src', 'img/3.jpg');
		}
	})
})
