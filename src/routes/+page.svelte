<script lang="ts">
	import { goto } from '$app/navigation';
	import { signPlayerIn, auth } from '$lib/firebase';
	import { onAuthStateChanged, updateProfile } from 'firebase/auth';
	import { onMount } from 'svelte';

	let name: string = '';

	// Check on mount if user is already logged in.
	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				goto('/lessons');
			}
		});

		return () => {
			unsubscribe();
		};
	});

	// Function to handle anonymous sign-in and navigation to lessons page
	const handleSignIn = async () => {
		if (!name.trim()) {
			// Ensure the name is not just whitespace
			alert('Name is required to sign in.');
			return;
		}
		try {
			const user = await signPlayerIn(); // Sign in anonymously using firebase
			if (user) {
				// Update the Firebase Auth profile with the user's name
				await updateProfile(user, { displayName: name });
			}
		} catch (error) {
			console.error('Sign in error:', error);
		}
	};
</script>

<h1>Welcome to the CSS Workshop</h1>
<p>
	This workshop is interactive and you'll be able to view and edit CSS as we go.
</p>
<h2>Ready to Join?</h2>
<form on:submit|preventDefault={handleSignIn}>
	<label for="name">Name</label>
	<input type="text" id="name" bind:value={name} required />
	<button type="submit">Begin</button>
</form>
