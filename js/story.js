$(() => {
	const options = { threshold: 0.5 }
	const observer = new IntersectionObserver(callback, options);

	const targets = ['isaias', 'atop', 'tweed', 'boundaries', 'visibility', 'hallway', 'monitor', 'beach'];
	for (t of targets) { observer.observe(document.querySelector('#' + t)); }
})

callback = (entries) => {
	const pics = {
	  isaias: '1.jpg',
	  atop: '2.jpg',
	  tweed: '3.gif',
		boundaries: '4.jpg',
		visibility: '5.gif',
		hallway: '6.jpg',
		monitor: '7.jpg',
		beach: '8.jpg'
	};
	const e = entries[0];
	if (e.isIntersecting) { $('#pic').attr('src', 'img/' + pics[e.target.id]); }
}
