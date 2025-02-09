import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	// Attempt to dynamically import the lesson content based on the slug
	try {
		const lessonImport = await import(
			`../../../lib/lessons/${params.slug}/Content.svx`
		);
		return {
			Content: lessonImport.default,
		};
	} catch (err) {
		console.error(err);
		// If no matching folder/file is found, throw a 404 error
		return {
			status: 404,
			error: new Error('Lesson not found'),
		};
	}
};
