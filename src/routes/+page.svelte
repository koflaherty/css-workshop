<script lang="ts">
	import { goto } from '$app/navigation';
	import { signPlayerIn } from '$lib/firebase';

	// Function to handle anonymous sign-in and navigation to landing page
	const handleSignIn = async () => {
		try {
			await signPlayerIn(); // Sign in anonymously using firebase
			goto('/landing'); // Navigate to the landing page
		} catch (error) {
			console.error('Sign in error:', error);
		}
	};
</script>

<h1>Welcome to the CSS Workshop</h1>
<p>
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
	documentation
</p>

<!-- Sign in button -->
<button on:click={handleSignIn}>Sign in Anonymously</button>
