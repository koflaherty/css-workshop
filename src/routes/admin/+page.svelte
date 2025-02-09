<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, realtimeDb } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { ref, onValue } from 'firebase/database';

	let currentUser: any = null; // Holds the authenticated user
	let loading = true; // To display a loading state
	let examples: { uid: string, css: string, html: string, name: string }[] = []; // List of saved CSS examples with user names

	// Pagination variables
	let currentPage: number = 1;
	const itemsPerPage: number = 24;
	$: paginatedExamples = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	$: totalPages = Math.ceil(examples.length / itemsPerPage);
	
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage = currentPage + 1;
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
		}
	}

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
					return { uid, css: value.css || '', html: value.html || '', name: value.name || 'Anonymous' };
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
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}
	.grid-item {
		border: 1px solid #ccc;
		padding: 0.5rem;
		text-align: center;
	}
	.pagination {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>

{#if loading}
	<p>Loading...</p>
{:else}
	<h1>Admin Page</h1>
	<p>Welcome, {currentUser.email}. This is the admin area.</p>

	<h2>Active Editing Examples</h2>
	{#if paginatedExamples.length > 0}
		<div class="grid">
			{#each paginatedExamples as example (example.uid)}
				<div class="grid-item">
					<h3>{example.name}</h3>
					<iframe 
					  srcdoc={`<html><head><style>${example.css}</style></head><body>${example.html}</body></html>`} 
					  sandbox="allow-scripts"
					  width="200" 
					  height="200">
					</iframe>
				</div>
			{/each}
		</div>
		<div class="pagination">
			<button on:click={prevPage} disabled={currentPage === 1}>Previous</button>
			<span>Page {currentPage} of {totalPages}</span>
			<button on:click={nextPage} disabled={currentPage === totalPages}>Next</button>
		</div>
	{:else}
		<p>No examples saved yet.</p>
	{/if}
{/if} 