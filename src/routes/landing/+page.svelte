<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout, realtimeDb, auth } from '$lib/firebase';
	import { ref, set } from 'firebase/database';
	import CssEditor from '$lib/components/CssEditor.svelte';

	// Handle logout and redirect to the home page.
	const handleLogout = async () => {
		try {
			await logout();
			goto('/');
		} catch (error) {
			console.error('Failed to log out:', error);
		}
	};

	// Function to save CSS to realtime DB whenever the user types.
	const handleCssChange = async (css: string) => {
		try {
			if (auth.currentUser) {
				await set(ref(realtimeDb, `users/${auth.currentUser.uid}/text`), css);
			}
		} catch (error) {
			console.error("Error saving text:", error);
		}
	};

	// Initial CSS for the three boxes
	const initialCss = 
`.box-a { background-color: red; width: 100px; height: 100px; }
.box-b { background-color: green; width: 100px; height: 100px; }
.box-c { background-color: blue; width: 100px; height: 100px; }`;

	// HTML content for the three boxes
	const htmlContent = `
		<div class="box-a">Box A</div>
		<div class="box-b">Box B</div>
		<div class="box-c">Box C</div>
	`;
</script>

<h1>Landing Page</h1>
<p>You are now signed in anonymously. Welcome!</p>

<!-- Use the CssEditor component with a callback prop and HTML content -->
<CssEditor initialCss={initialCss} html={htmlContent} onCssChange={handleCssChange} />

<!-- Logout button -->
<button on:click={handleLogout}>Logout</button>
