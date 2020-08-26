$(function() {
	var w = $('.content h2');
	var n = $('#nav')[0];
	for (var i = 0; i < w.length; i++) {
    var h = $(w[i]).html();
		$(w[i]).attr('id', h);
    $(n).append('<a target="_self" href="#' + h + '">' + h + '</a> <br>');
	}

	var observer = new IntersectionObserver(callback);

	var targets = ['isaias', 'atop', 'two'];
	for (var i = 0; i < targets.length; i++) {
		observer.observe(document.querySelector('#' + targets[i]));
	}
})

function callback(entries) {
	var p = $('#pic');
	var e = entries[0];

	if (e.isIntersecting) {
		if (e.target.id == 'isaias') { $(p).attr('src', 'img/1.jpg'); }
		if (e.target.id == 'atop') { $(p).attr('src', 'img/2.jpg'); }
		if (e.target.id == 'two') { $(p).attr('src', 'img/3.jpg'); }
	}
}
