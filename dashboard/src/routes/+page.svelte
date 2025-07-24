<script lang="ts">
	import DeviceStatus from './DeviceStatus.svelte';
	import {
		switchSortingStatus,
		sharedState,
		reloadDevices,
		SortingStatus
	} from '$lib/state.svelte';
	import { CyclerStatus } from '$lib/cycler';

	let filterStatus = $state(SortingStatus.NORMAL);
	let searchText = $state('');
	let deviceList = $derived(
		searchText
			? sharedState.cyclerList.filter((device) => device.id.toString().includes(searchText))
			: sharedState.cyclerList
	);
	let lastRefresh = $derived(
		sharedState.lastRefresh === -1 ? 'None' : new Date(sharedState.lastRefresh).toLocaleString()
	);
</script>

<div class="m-auto flex w-3/4 items-center justify-end gap-4">
	<input
		class="rounded-lg border border-black p-0.5 dark:border-white"
		type="text"
		placeholder="Cycler"
		bind:value={searchText}
	/>
	<span>Last refresh: {lastRefresh}</span>
	<button
		class="rounded-lg border border-black bg-amber-300 p-2 text-black hover:bg-amber-500"
		onclick={reloadDevices}>Reload</button
	>
	<button
		class="rounded-lg border border-black bg-amber-300 p-2 text-black hover:bg-amber-500 {filterStatus ===
		SortingStatus.ACTIVE
			? 'bg-orange-600'
			: ''}"
		onclick={() => {
			filterStatus =
				filterStatus === SortingStatus.NORMAL ? SortingStatus.ACTIVE : SortingStatus.NORMAL;
			switchSortingStatus(filterStatus);
		}}>Filter active</button
	>
</div>

<div class="mt-4 text-center text-xl">
	Active: {deviceList.reduce(
		(count, device) => (device.status === CyclerStatus.STATUS_ACTIVE ? count + 1 : count),
		0
	)}
	Paused: {deviceList.reduce(
		(count, device) => (device.status === CyclerStatus.STATUS_PAUSED ? count + 1 : count),
		0
	)}
</div>

{#if deviceList.length > 0}
	<div class="flex justify-center p-4">
		<div
			class="grid max-h-[85vh] w-[80%] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-y-scroll p-4"
		>
			{#each deviceList as device}
				<DeviceStatus id={device.id} status={device.status} />
			{/each}
		</div>
	</div>
{/if}
