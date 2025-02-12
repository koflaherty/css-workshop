<script lang="ts">
	export let content: string | HTMLElement;
	export let title = 'Toolbox';
	let isOpen = false;

	function toggleToolbox() {
		isOpen = !isOpen;
	}
</script>

<style scoped>
	.toolbox {
		border: 1px solid #ccc;
		border-radius: 4px;
		margin: 1rem 0;
	}

	.toolbox-header {
		width: 100%;
		padding: 0.5rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: none;
		border: none;
		cursor: pointer;
	}

	.toolbox-header:hover {
		background-color: #f5f5f5;
	}

	.toolbox-header h2 {
		margin: 0;
		font-size: 1.25rem;
	}

	.toolbox-content {
		padding-left: 1rem;
		padding-right: 1rem;
		border-top: 1px solid #ccc;
	}

	:global(.toolbox-content ul) {
		list-style: none;
		padding: 0;
	}

	.arrow {
		color: #557;
		display: inline-block;
		transition: transform 0.2s ease;
	}
</style>

<div class="toolbox">
	<button
		class="toolbox-header"
		on:click={toggleToolbox}
		aria-expanded={isOpen}
	>
		<h2>{title}</h2>
		<span class="arrow" style="transform: rotate({isOpen ? '90' : '0'}deg);"
			>▶</span
		>
	</button>

	{#if isOpen}
		<div class="toolbox-content">
			<slot>{content}</slot>
		</div>
	{/if}
</div>
