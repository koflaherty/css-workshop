<script>
	import { goto } from '$app/navigation';
	import { auth, realtimeDb } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { ref, onValue } from 'firebase/database';
	import { page } from '$app/stores';

	let loaded = false;
	let error = false;

	onMount(() => {
		try {
			// Auth listener
			const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
				if (!user) {
					goto('/');
				}
			});

			// Active lesson listener
			const activeLessonRef = ref(realtimeDb, 'activeLesson');
			const unsubscribeLesson = onValue(
				activeLessonRef,
				(snapshot) => {
					const activeLesson = snapshot.val();
					if (activeLesson) {
						// Only navigate if we're not already on the active lesson page
						if (!$page.url.pathname.includes(`/lessons/${activeLesson}`)) {
							goto(`/lessons/${activeLesson}`);
						}
					}
					loaded = true;
				},
				() => {
					loaded = true;
				}
			);

			return () => {
				unsubscribeAuth();
				unsubscribeLesson();
			};
		} catch (e) {
			error = true;
			console.error('Error in lessons layout:', e);
		}
	});
</script>

{#if loaded || error}
	<slot />
{/if}
