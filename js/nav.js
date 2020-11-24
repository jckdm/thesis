$(() => {
	const page = window.location.href.split('/');
	const curr = page[page.length - 1].slice(0, -5);

	$('body').prepend('<span id=\"title\">DD: ' + curr.charAt(0).toUpperCase() + curr.slice(1) + '</span><div class=\"space\"></div><span id=\"navbtn\" onclick=\"$(\'#nav\').css(\'display\', \'block\')\">&#9776;</span><div id=\"nav\"><div id=\"navlinks\"></div><div class=\"space\"></div><div id=\"sublinks\"><text>----<text> <br> <br><a href=\"proposal.html\" target=\"_self\">Proposal</a> <br><a href=\"story.html\" target=\"_self\">Story</a> <br><a href=\"viz.html\" target=\"_self\">Viz</a> <br><a onclick=\"$(\'.overlay\').css(\'visibility\', \'visible\')\">About</a> <br></div><span id=\"closebtn\" onclick=\"$(\'#nav\').css(\'display\', \'none\')\">&times;</span></div>');

	const links = document.getElementById('nav').getElementsByTagName('a');

	for (let i = 0; i < links.length - 1; i++) {
		if (links[i].attributes.href.value == curr + '.html') {
			links[i].removeAttribute('href');
			links[i].setAttribute('id', 'curr');
		}
	}

	const content = $('#content text');
	const n = $('#navlinks')[0];
	for (c of content) {
    const h = $(c).html();
		$(c).attr('id', h);
    $(n).append('<a target="_self" href="#' + h + '">' + h + '</a> <br>');

	}
})
