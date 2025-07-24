<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<h1>Hero Dashboard</h1>

{@render children()}

<style>
	@media (prefers-color-scheme: dark) {
		:root {
			--bg-color: #181818;
			--text-color: #ffffff;
		}
	}

	h1 {
		text-align: center;
		font-size: 3rem;
		padding: 0.5rem;
	}

	:global(body) {
		margin: 0;
		background-color: var(--bg-color);
		color: var(--text-color);
	}
</style>
