<script lang="ts">
	import { CyclerStatus } from '$lib/cycler';
	import { switchDeviceStatus } from '../lib/state.svelte';

	let { id, status } = $props();

	let isActive = $derived(status === CyclerStatus.STATUS_ACTIVE);
</script>

<div
	class="flex items-center rounded-lg border border-gray-600 bg-gray-200 p-4 text-black shadow-md hover:bg-gray-300 {isActive
		? 'shadow-lime-100'
		: 'shadow-red-100'}"
>
	<span class="mr-2 h-5 w-5 rounded-full {isActive ? 'bg-green-600' : 'bg-red-600'}"></span>
	<a href="/detail/{id}"><strong>Cycler {id}</strong></a>
	<button
		class="m-auto rounded-xl border-2 border-gray-600 p-1 {isActive
			? 'bg-red-600'
			: 'bg-green-600'} hover:!bg-orange-600"
		onclick={() => switchDeviceStatus(id)}>{isActive ? 'Stop' : 'Start'}</button
	>
</div>
