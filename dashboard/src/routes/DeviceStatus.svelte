<script lang="ts">
	import { CyclerStatus } from '$lib/cycler';
	import { switchDeviceStatus } from '../lib/state.svelte';

	let { id, status } = $props();

	let statusColor = $derived(status === CyclerStatus.STATUS_ACTIVE ? 'green' : 'red');
	let buttonText = $derived(status === CyclerStatus.STATUS_ACTIVE ? 'Stop' : 'Start');
	let buttonColor = $derived(status === CyclerStatus.STATUS_ACTIVE ? 'red' : 'green');
</script>

<div class="device">
	<span class="status-indicator" style="background-color: {statusColor}"></span>
	<a href="/detail/{id}"><strong>Cycler {id}</strong></a>
	<button style="background-color: {buttonColor}" onclick={() => switchDeviceStatus(id)}
		>{buttonText}</button
	>
</div>

<style>
	.status-indicator {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		display: inline-block;
		margin-right: 0.5rem;
	}
	.device {
		border: 1px solid #ccc;
		padding: 1rem;
		border-radius: 6px;
		background: #ededed;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		color: #000000;
		transition: all 0.3s ease-in-out;
		display: flex;
		align-items: center;
	}

	.device:hover {
		background: #ababab;
	}
	button {
		border: 2px solid #000;
		border-radius: 8px;
		opacity: 0.8;
		padding: 4px;
		margin: auto;
	}

	button:hover {
		background: #5555bb !important;
	}
</style>
