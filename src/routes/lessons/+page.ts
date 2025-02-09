import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Replace this with your real lessons list or fetch from an API, etc.
	const lessons = [
		{ slug: '01-display', title: 'Mastering the CSS Display Property' },
		// { slug: '02-layout', title: 'An Example Second Lesson' },
	];

	return { lessons };
}; 