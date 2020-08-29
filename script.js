$(function() {
	var w = $('#content text');
	var n = $('#navlinks')[0];
	for (var i = 0; i < w.length; i++) {
    var h = $(w[i]).html();
		$(w[i]).attr('id', h);
    $(n).append('<a target="_self" href="#' + h + '">' + h + '</a> <br>');
	}

	var options = { threshold: 0.5 }
	var observer = new IntersectionObserver(callback, options);

	var targets = ['isaias', 'atop', 'tweed'];
	for (var i = 0; i < targets.length; i++) {
		observer.observe(document.querySelector('#' + targets[i]));
	}
})

function callback(entries) {
	var pics = {
	  isaias: '1.jpg',
	  atop: '2.jpg',
	  tweed: '3.gif'
	};
	var e = entries[0];
	if (e.isIntersecting) { $('#pic').attr('src', 'img/' + pics[e.target.id]); }
}
