import type { PageLoad } from './$types';
import { lessons } from './lessons';

export const load: PageLoad = async () => {
	return { lessons };
};
