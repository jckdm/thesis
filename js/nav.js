$(() => {
	const w = $('#content text');
	const n = $('#navlinks')[0];
	for (let i = 0; i < w.length; i++) {
    const h = $(w[i]).html();
		$(w[i]).attr('id', h);
    $(n).append('<a target="_self" href="#' + h + '">' + h + '</a> <br>');
	}
})
