$(function() {
	var w = $('.content text');
	var n = $('#nav')[0];
	for (var i = 0; i < w.length; i++) {
    var h = $(w[i]).html();
		$(w[i]).attr('id', h);
    $(n).append('<a target="_self" href="#' + h + '">' + h + '</a> <br>');
	}
	$(n).append('<br> <a id="sub" href="https://jackadam.cc" target="_blank">JACK ADAM</a> <br> <a href="https://github.com/jckdm/thesis" target="_blank">readme.md</a>');

	var options = { threshold: 0.5 }
	var observer = new IntersectionObserver(callback, options);

	var targets = ['isaias', 'atop'];
	for (var i = 0; i < targets.length; i++) {
		observer.observe(document.querySelector('#' + targets[i]));
	}
})

function callback(entries) {
	var p = $('#pic');
	var e = entries[0];

	if (e.isIntersecting) {
		if (e.target.id == 'isaias') { $(p).attr('src', 'img/1.jpg'); }
		else if (e.target.id == 'atop') { $(p).attr('src', 'img/2.jpg'); }
	}
}
