<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<h1 class="mb-3 p-4 text-center text-5xl">Hero Dashboard</h1>

{@render children()}
