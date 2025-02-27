<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/themes/prism.css'; // Choose your preferred theme
	import { onMount } from 'svelte';

	export let initialCss: string = '';
	export let onCssChange: (data: {
		css: string;
		html: string;
	}) => void = () => {};
	export let html: string = '';
	export let rows: number = 10;

	// The text content of the editor
	let text: string = initialCss;

	// Highlighted code computed via PrismJS
	$: highlightedCss = Prism.highlight(text, Prism.languages.css, 'css');

	// Preview iframe document (optional)
	$: srcDoc = `<html><head><style>${text}</style></head><body>${html}</body></html>`;

	// Validates CSS if needed (dummy implementation below)
	function isValidCSS(css: string): boolean {
		// Replace with your actual validation logic if necessary.
		return true;
	}

	// Update text on user input.
	function handleInput(event: Event) {
		text = (event.target as HTMLTextAreaElement).value;
		if (isValidCSS(text)) {
			onCssChange({ css: text, html });
		} else {
			console.error('Invalid CSS');
		}
	}

	// Allow tab insertion inside the textarea.
	function handleKeyDown(event: KeyboardEvent) {
		const textarea = event.target as HTMLTextAreaElement;
		if (event.key === 'Tab') {
			event.preventDefault();
			event.stopPropagation();
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			text = text.substring(0, start) + '\t' + text.substring(end);
			textarea.value = text;
			textarea.selectionStart = textarea.selectionEnd = start + 1;
		} else if (event.key === 'ArrowDown') {
			// If the caret is at the very end of the text, insert a new line.
			if (textarea.selectionStart === text.length) {
				event.preventDefault();
				const start = textarea.selectionStart;
				text =
					text.substring(0, start) +
					'\n' +
					text.substring(textarea.selectionEnd);
				textarea.value = text;
				// Update caret to immediately after the inserted newline
				textarea.selectionStart = textarea.selectionEnd = start + 1;
				// Notify parent via onCssChange callback
				onCssChange({ css: text, html });
			}
		} else if (event.key === 'Escape') {
			// Unfocus the textarea
			textarea.blur();
		}
	}

	// Synchronize scrolling between the textarea and highlighted pre element.
	let editorEl: HTMLTextAreaElement;
	let preEl: HTMLElement;
	function syncScroll() {
		if (editorEl && preEl) {
			preEl.scrollTop = editorEl.scrollTop;
			preEl.scrollLeft = editorEl.scrollLeft;
		}
	}
</script>

<style scoped>
	.split-container {
		margin-top: 1.75rem;
		margin-bottom: 1.75rem;
		display: flex;
	}

	.controls {
		position: absolute;
		top: 4px;
		right: 4px;
		z-index: 1;
	}

	.preview-iframe {
		display: block;
		border: 1px solid #ccc;
		width: 100%;
		margin: 0 auto;
	}

	.editor {
		height: 100%;
	}

	.editor-container {
		position: relative;
		width: 100%;
		min-height: 150px; /* Adjust as needed */
		border: 1px solid #ccc; /* Move the border here */
		box-sizing: border-box;
	}

	/* Ensure both layers share the same styling */
	.editor-container pre,
	.editor-container textarea {
		margin: 0;
		padding: 0.5em;
		font-family: var(--code-font);
		font-size: 14px;
		line-height: 1.2em;
		white-space: pre-wrap;
		word-wrap: break-word;
		box-sizing: border-box;
		-moz-tab-size: 2;
		tab-size: 2;
		width: 100%;
		font-family: var(--code-font);
		border: none;
	}

	/* Highlighted code layer styling */
	.highlighted-code {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none; /* so clicks pass through to the textarea */
		overflow: hidden;
		background-color: var(--code-background);
	}

	/* Transparent textarea on top */
	.editor {
		position: relative;
		background: transparent;
		color: transparent; /* hide raw text so only highlighted code shows */
		caret-color: black; /* ensure the caret remains visible */
		resize: none;
		overflow: auto;
		z-index: 1;
		border: none;
	}
</style>

<div class="split-container">
	<div class="editor-container">
		<!-- Highlighted code layer -->
		<pre class="highlighted-code" bind:this={preEl}><code
				>{@html highlightedCss}<br/></code
			></pre>
		<!-- Transparent textarea layer -->
		<textarea
			class="editor"
			placeholder="Type your CSS here..."
			on:input={handleInput}
			on:keydown={handleKeyDown}
			bind:value={text}
			on:scroll={syncScroll}
			{rows}
			bind:this={editorEl}
		></textarea>

		<div class="controls">
			<button
				on:click={() => {
					text = initialCss;
					onCssChange({ css: text, html });
				}}>Reset CSS</button
			>
		</div>
	</div>
	<iframe class="preview-iframe" srcdoc={srcDoc} sandbox="allow-scripts"
	></iframe>
</div>
