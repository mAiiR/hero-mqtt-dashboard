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

<div class="header">
	<input type="text" placeholder="Cycler" bind:value={searchText} />
	<span>Last refresh: {lastRefresh}</span>
	<button onclick={reloadDevices}>Reload</button>
	<button
		class={filterStatus === SortingStatus.ACTIVE ? 'buttonbgactive' : ''}
		onclick={() => {
			filterStatus =
				filterStatus === SortingStatus.NORMAL ? SortingStatus.ACTIVE : SortingStatus.NORMAL;
			switchSortingStatus(filterStatus);
		}}>Filter active</button
	>
</div>

<div class="subheader">
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
	<div class="wrapper">
		<div class="grid">
			{#each deviceList as device}
				<DeviceStatus id={device.id} status={device.status} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1rem;
		width: 80%;
		overflow-y: scroll;
		max-height: 85vh;
	}
	.wrapper {
		display: flex;
		justify-content: center;
		padding: 1rem;
	}
	.header {
		display: flex;
		justify-content: flex-end;
		gap: 20px;
		margin-right: 5rem;
		align-items: center;
	}
	.header input {
		border: 1px solid black;
		border-radius: 4px;
		padding: 2px;
	}
	.subheader {
		text-align: center;
		font-size: 1.2rem;
	}
	button {
		background-color: bisque;
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid black;
	}
	button:hover {
		background-color: cadetblue;
		cursor: pointer;
	}
	.buttonbgactive {
		background-color: firebrick;
	}
</style>
