<script lang="ts">
	export let data;
</script>

<!-- Render whichever component was loaded in +page.ts -->
{#if data.error}
  <h1>{data.error.message}</h1>
  <p>
    This lesson could not be found.
  </p>
{:else}
  <svelte:component this={data.Content} />
{/if} 