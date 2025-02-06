<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword } from 'firebase/auth';

	// Bind email and password inputs
	let email: string = '';
	let password: string = '';
	let errorMsg: string = '';

	// Function to handle login with email and password.
	const handleLogin = async () => {
		errorMsg = '';
		try {
			await signInWithEmailAndPassword(auth, email, password);
			// On successful login, navigate to the admin page.
			goto('/admin');
		} catch (error: any) {
			console.error('Login error:', error);
			errorMsg = "Login failed: " + error.message;
		}
	};
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
	<label>
		Email:
		<input type="email" bind:value={email} required />
	</label>
	<br />

	<label>
		Password:
		<input type="password" bind:value={password} required />
	</label>
	<br />

	<button type="submit">Login</button>
</form>

{#if errorMsg}
	<p style="color: red;">{errorMsg}</p>
{/if} 