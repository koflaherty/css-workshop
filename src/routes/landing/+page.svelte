<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout, realtimeDb, auth } from '$lib/firebase';
	import { ref, set } from 'firebase/database';

	// Handle logout and redirect to the home page.
	const handleLogout = async () => {
		try {
			await logout();
			goto('/');
		} catch (error) {
			console.error('Failed to log out:', error);
		}
	};

	// Reactive variable to hold the CSS from the textbox.
	let text: string = '';

	// Reactive computed source document for the preview iframe.
	$: srcDoc = `<html><head><style>${text}</style></head><body><div class="example-window">Example Content</div></body></html>`;

	// Event handler to save CSS to realtime DB whenever the user types.
	const handleInput = async (event: Event) => {
		text = (event.target as HTMLTextAreaElement).value;
		try {
			if (auth.currentUser) {
				await set(ref(realtimeDb, `users/${auth.currentUser.uid}/text`), text);
			}
		} catch (error) {
			console.error("Error saving text:", error);
		}
	};
</script>

<h1>Landing Page</h1>
<p>You are now signed in anonymously. Welcome!</p>

<!-- Updated textbox for real-time CSS input -->
<textarea
	placeholder="Type your CSS here..."
	on:input={handleInput}
	bind:value={text}
	rows="4"
	cols="50" />

<!-- Preview window -->
<h2>Example Window</h2>
<iframe srcdoc={srcDoc} width="100%" height="200px" sandbox="allow-scripts" />

<!-- Logout button -->
<button on:click={handleLogout}>Logout</button>
