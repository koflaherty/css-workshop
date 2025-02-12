<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, realtimeDb } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { ref, onValue } from 'firebase/database';

	let currentUser: any = null; // Holds the authenticated user
	let loading = true; // To display a loading state
	let examples: { uid: string; css: string; html: string; name: string }[] = []; // List of saved CSS examples with user names

	onMount(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (!user) {
				// If no user is logged in, redirect to login
				goto('/login');
			} else if (user.isAnonymous) {
				// If the user is logged in anonymously, redirect to login
				goto('/login');
			} else {
				// If a valid email/password user is logged in, allow access
				currentUser = user;
			}
			loading = false;
		});

		// Subscribe to the "users" node to get all saved CSS examples.
		const usersRef = ref(realtimeDb, 'users/');
		const unsubscribeUsers = onValue(usersRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				examples = Object.entries(data).map(([uid, value]: [string, any]) => {
					return {
						uid,
						css: value.css || '',
						html: value.html || '',
						name: value.name || 'Anonymous',
					};
				});
			} else {
				examples = [];
			}
		});

		return () => {
			unsubscribeAuth();
			unsubscribeUsers();
		};
	});
</script>

<style>
	.container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		margin: 20px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
		flex: 1 1 auto; /* Allow grid to grow and fill available space */
		overflow-y: auto;
	}

	.grid-item {
		position: relative;
		border: 1px solid #ccc;
		padding: 0.5rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 220px;
	}

	iframe {
		flex-grow: 1;
		border: none;
		width: 100%;
		height: 100%;
	}

	.name {
		font-size: 1.2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		display: inline;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 0.5rem;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>

{#if loading}
	<p>Loading...</p>
{:else}
	<div class="container">
		{#if examples.length > 0}
			<div class="grid">
				{#each examples as example (example.uid)}
					<div class="grid-item">
						<div class="name">{example.name}</div>
						<iframe
							srcdoc={`<html><head><style>${example.css}</style></head><body>${example.html}</body></html>`}
							sandbox="allow-scripts"
							width="100%"
							height="100%"
						>
						</iframe>
					</div>
				{/each}
			</div>
		{:else}
			<p>No examples saved yet.</p>
		{/if}
	</div>
{/if}
