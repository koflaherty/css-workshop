<script lang="ts">
	import CssEditor from '$lib/components/CssEditor.svelte';
	import { ref, set } from 'firebase/database';
	import { realtimeDb, auth } from '$lib/firebase';

	export let initialCss: string;
	export let htmlContent: string;

	/**
	 * handleCssChange
	 * Saves the updated CSS/HTML to Firebase.
	 */
	async function handleCssChange({ css, html }: { css: string; html: string }) {
		try {
			if (auth.currentUser) {
				await set(ref(realtimeDb, `users/${auth.currentUser.uid}`), { css, html });
			}
		} catch (error) {
			console.error('Error saving css and html:', error);
		}
	}
</script>

<CssEditor
  initialCss={initialCss}
  html={htmlContent}
  onCssChange={handleCssChange}
/> 