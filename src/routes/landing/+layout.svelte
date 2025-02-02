<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';

	// When the component mounts, we subscribe to auth state changes.
	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				// Redirect to the homepage if not logged in.
				goto('/');
			}
		});
		return () => unsubscribe();
	});
</script>

<slot />
