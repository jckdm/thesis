$(() => {
	// get URL of current page to determine which page name to highlight in nav bar
	const page = window.location.href.split('/');
	const curr = page[page.length - 1].slice(0, -5);

	// append nav bar
	$('body').prepend('<span id=\"title\">DD: ' + curr.charAt(0).toUpperCase() + curr.slice(1) + '</span><div class=\"space\"></div><span id=\"navbtn\" onclick=\"$(\'#nav\').css(\'display\', \'block\')\">&#9776;</span><div id=\"nav\"><div id=\"navlinks\"></div><div class=\"space\"></div><div id=\"sublinks\"><text>—o—</text> <br> <br><a href=\"proposal.html\" target=\"_self\">Proposal</a> <br><a href=\"journal.html\" target=\"_self\">Journal</a> <br><a href=\"visualizations.html\" target=\"_self\">Visualizations</a> <br> <br> <a style="cursor: default" href="" target="_self">Videos <i>(soon)</i></a> <br> <br> <a onclick=\"$(\'.overlay\').css(\'visibility\', \'visible\')\">About</a> <br></div><span id=\"closebtn\" onclick=\"$(\'#nav\').css(\'display\', \'none\')\">&times;</span></div>');

	const links = document.getElementById('nav').getElementsByTagName('a');

	// loop over all links
	for (let i = 0; i < links.length - 1; i++) {
		// and remove href from current page, instead adding an ID
		if (links[i].attributes.href.value == curr + '.html') {
			links[i].removeAttribute('href');
			links[i].setAttribute('id', 'curr');
		}
	}

	// get all blog post titles
	const content = $('#content text');
	const n = $('#navlinks')[0];
	// for each title,
	for (c of content) {
    const h = $(c).html();
		// give unique ID and href to that blog post's title
		$(c).attr('id', h);
    $(n).append('<a target="_self" href="#' + h + '">' + h + '</a> <br>');
	}
});
