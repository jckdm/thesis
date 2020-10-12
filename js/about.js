$(() => {
	var x = "<span id=\'abtclose\' onclick=\"$(\'.about-overlay\').css(\'visibility\', \'hidden\')\">&times;</span>";

	$('body').append('<div class="about-overlay"><div class="about-overlay-content">' + x + '<br><p>Digital Distancing is a senior project in <a href="https://c2.cs.yale.edu/" target="_blank">Computing & the Arts</a> at Yale University by <a href="https://jackadam.cc" target="_blank">Jack Adam</a>.</p><p> Conceptualized in the summer of 2020 and executed in the fall, it examines the relationship between data tracking and physical distancing. For more information, <a href="proposal.html" target="_self">read the full proposal</a> or <a href="https://github.com/jckdm/thesis" target="_blank">check out the code</a>.</p></div></div>');
})
