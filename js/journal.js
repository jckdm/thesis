$(() => {
	// don't show image until 100% of pixels of target are showing
	const options = { threshold: 1.0 }
	const observer = new IntersectionObserver(callback, options);

	// IDs of targets
	const targets = ['isaias', 'tweed', 'boundaries', 'visibility', 'hallway', 'monitor', 'footprints', 'ballot', 'wifi', 'tundra', 'desperation'];
	// observe each
	for (t of targets) { observer.observe(document.querySelector('#' + t)); }
})

callback = (entries) => {
	// dictionary of IDs and image filenames
	const pics = {
	  isaias: '1.jpg',
	  tweed: '2.gif',
		boundaries: '3.jpg',
		visibility: '4.gif',
		hallway: '5.jpg',
		monitor: '6.jpg',
		footprints: '7.jpg',
		ballot: '8.jpg',
		wifi: '9.jpg',
		tundra: '10.jpg',
		desperation: '11.jpg'
	};
	// if window intersects target, show image!
	const e = entries[0];
	if (e.isIntersecting) { $('#pic').attr('src', 'img/' + pics[e.target.id]); }
}
