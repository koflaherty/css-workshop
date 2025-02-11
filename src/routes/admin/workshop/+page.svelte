<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, realtimeDb } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { ref, set, onValue } from 'firebase/database';
	import { lessons } from '../../lessons/lessons';

	let currentUser: any = null;
	let loading = true;
	let activeLesson: string | null = null;

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				goto('/login');
			} else if (user.isAnonymous) {
				goto('/login');
			} else {
				currentUser = user;
			}
			loading = false;
		});

		// Subscribe to active lesson changes
		const activeLessonRef = ref(realtimeDb, 'activeLesson');
		const unsubscribeLesson = onValue(activeLessonRef, (snapshot) => {
			activeLesson = snapshot.val();
		});

		return () => {
			unsubscribe();
			unsubscribeLesson();
		};
	});

	async function setActiveLesson(slug: string | null) {
		try {
			const activeLessonRef = ref(realtimeDb, 'activeLesson');
			await set(activeLessonRef, slug);
		} catch (error) {
			console.error('Error setting active lesson:', error);
			alert('Failed to set active lesson');
		}
	}
</script>

<style>
	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.lesson-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.lesson-button {
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #f8f8f8;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.lesson-button:hover {
		background-color: #eee;
		transform: translateY(-2px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	h1 {
		margin-bottom: 1rem;
	}

	.lesson-button.active {
		background-color: #4caf50;
		color: white;
		border-color: #45a049;
	}

	.lesson-button.active:hover {
		background-color: #45a049;
	}
</style>

{#if loading}
	<p>Loading...</p>
{:else}
	<div class="container">
		<h1>Workshop Control Panel</h1>
		<div class="lesson-grid">
			{#each lessons as lesson}
				<button
					class="lesson-button"
					class:active={activeLesson === lesson.slug}
					on:click={() => setActiveLesson(lesson.slug)}
				>
					{lesson.title}
				</button>
			{/each}
			<button
				class="lesson-button"
				class:active={activeLesson === null}
				on:click={() => setActiveLesson(null)}
			>
				Clear Active Lesson
			</button>
		</div>
	</div>
{/if}
