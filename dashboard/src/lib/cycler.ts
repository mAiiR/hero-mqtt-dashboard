export enum CyclerStatus {
	STATUS_ACTIVE = 'active',
	STATUS_PAUSED = 'paused'
}

export class Cycler {
	readonly id: number;
	status: CyclerStatus;
	lastUpdate: number = -1;

	constructor(id: number, status: CyclerStatus, lastUpdate: number) {
		this.id = id;
		this.status = status;
		this.lastUpdate = lastUpdate;
	}
}
