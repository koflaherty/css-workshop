<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/themes/prism.css'; // You can choose a different theme if you like

	export let initialCss: string = '';
	export let onCssChange: (css: string) => void = () => {};
	export let html: string = '';

	let text: string = initialCss;

	// Reactive computed source document for the preview iframe.
	$: srcDoc = `<html><head><style>${text}</style></head><body><div class="example-window">Example Content</div></body></html>`;

	// Helper function to validate CSS using a detached document
	const isValidCSS = (css: string): boolean => {
		const iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		const style = iframe.contentDocument?.createElement('style');
		if (style) {
			style.textContent = css;
			iframe.contentDocument?.head?.appendChild(style);
			const isValid = (style.sheet?.cssRules.length ?? 0) > 0;
			document.body.removeChild(iframe);
			return isValid;
		}
		document.body.removeChild(iframe);
		return false;
	};

	// Event handler to validate CSS whenever the user types.
	const handleInput = (event: Event) => {
		text = (event.target as HTMLTextAreaElement).value;
		if (isValidCSS(text)) {
			onCssChange(text);
		} else {
			console.error("Invalid CSS");
		}
	};

	// Function to reset CSS to the initial state
	const resetCss = () => {
		text = initialCss;
		onCssChange(text);
	};

	// Event handler to allow tab characters in the textarea
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			const textarea = event.target as HTMLTextAreaElement;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			// Insert tab character at the cursor position
			text = text.substring(0, start) + '\t' + text.substring(end);

			// Update the textarea value
			textarea.value = text;

			// Move caret to the correct position after the tab
			textarea.selectionStart = textarea.selectionEnd = start + 1;
		}
	};

	// Highlight the CSS code using Prism.js
	$: highlightedCss = Prism.highlight(text, Prism.languages.css, 'css');
</script>

<!-- Updated textbox for real-time CSS input -->
<textarea
	placeholder="Type your CSS here..."
	on:input={handleInput}
	on:keydown={handleKeyDown}
	bind:value={text}
	rows="10"
	cols="50"
>
</textarea>

<!-- Reset button -->
<button on:click={resetCss}>Reset CSS</button>

<!-- Display highlighted CSS code -->
<pre class="language-css"><code>{@html highlightedCss}</code></pre>

<!-- Preview window using the html prop -->
<h2>Example Window</h2>
<iframe srcdoc={`<html><head><style>${text}</style></head><body>${html}</body></html>`} width="100%" height="200px" sandbox="allow-scripts" />

<style scoped>
	textarea {
		tab-size: 2; /* Adjust the tab size to 2 spaces */
		width: 100%; 
	}
	pre {
		background: #f5f5f5; /* Adjust based on your theme */
		padding: 10px;
		border-radius: 5px;
		overflow-x: auto;
	}
</style> 