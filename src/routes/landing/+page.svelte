<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, logout, realtimeDb } from '$lib/firebase';
	import { ref, set } from 'firebase/database';
	import MarkdownExample from '../../lessons/MarkdownExample.svx';

	// Handle logout and redirect to the home page.
	const handleLogout = async () => {
		try {
			await logout();
			goto('/');
		} catch (error) {
			console.error('Failed to log out:', error);
		}
	};
</script>

<h1>Landing Page</h1>
<p>You are now signed in anonymously. Welcome!</p>

<!-- Render our MDsvex component -->
<MarkdownExample name="SvelteKit" />

<!-- Logout button -->
<button on:click={handleLogout}>Logout</button>
