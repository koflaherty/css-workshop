<script lang="ts">
	export let data: {
		lessons: { slug: string; title: string }[];
	};
</script>

<h1>All Lessons</h1>
<p>Pick a lesson from the list below:</p>

<ul>
	{#each data.lessons as lesson}
		<li>
			<a href="/lessons/{lesson.slug}">{lesson.title}</a>
		</li>
	{/each}
</ul>
