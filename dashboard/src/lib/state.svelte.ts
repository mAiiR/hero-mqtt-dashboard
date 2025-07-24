import mqtt from 'mqtt';
import { Cycler, CyclerStatus } from './cycler.js';
import { PUBLIC_MQTT_BROKER_URL } from '$env/static/public';

export const sharedState: { cyclerList: Cycler[]; lastRefresh: number } = $state({
	cyclerList: [],
	lastRefresh: -1
});

export enum SortingStatus {
	NORMAL,
	ACTIVE
}

let filterStatus = SortingStatus.NORMAL;

const client = mqtt.connect(PUBLIC_MQTT_BROKER_URL);
client.on('connect', () => {
	console.log('Connected to MQTT broker');
	client.subscribe('status', (err) => {
		if (err) {
			console.error('Subscription error:', err);
		} else {
			console.log('Subscribed to status topic');
		}
	});
	setInterval(() => sortDeviceList(), 1000);
});

client.on('message', (topic, message) => {
	const msg = message.toString();
	const id = parseInt(msg.split(' ')[1]);
	const status = msg.split(' ')[3].split('!')[0] as CyclerStatus;
	updateDeviceStatus(id, status);
});

function updateDeviceStatus(deviceId: number, status: CyclerStatus) {
	const deviceIndex = sharedState.cyclerList.findIndex((d) => d.id === deviceId);
	if (deviceIndex !== -1) {
		if (status != sharedState.cyclerList[deviceIndex].status) {
			sharedState.cyclerList[deviceIndex] = new Cycler(deviceId, status, Date.now());
		}
	} else {
		sharedState.cyclerList.push(new Cycler(deviceId, status, Date.now()));
	}
	if (Date.now() - sharedState.lastRefresh > 1000) {
		sharedState.lastRefresh = Date.now();
	}
}

function sortDeviceList() {
	if (filterStatus === SortingStatus.NORMAL) {
		sharedState.cyclerList.sort((a, b) => a.id - b.id);
	} else {
		sharedState.cyclerList.sort((a, b) => {
			if (a.status !== b.status) {
				return a.status === CyclerStatus.STATUS_ACTIVE ? -1 : 1;
			}
			return a.id - b.id;
		});
	}
}

export function reloadDevices() {
	sharedState.cyclerList = [];
}

export function switchSortingStatus(status: SortingStatus) {
	if (status) {
		filterStatus = SortingStatus.ACTIVE;
	} else {
		filterStatus = SortingStatus.NORMAL;
	}
	sortDeviceList();
}

export function switchDeviceStatus(deviceId: number) {
	const device = sharedState.cyclerList.find((d) => d.id === deviceId);
	if (device) {
		console.log(device.id);
		client.publish('command', deviceId.toString());
	}
}
