export type SirenType = 'GPRS' | 'Ethernet';

export type SirenStatus = 'active' | 'inactive' | 'warning' | 'alert';

export interface Siren {
	id: string;
	name: string;
	type: SirenType[];
	location: string;
	status: SirenStatus;
	lastChecked: string;
	latitude: number;
	longitude: number;
	district: string;
	block: string;
	parent_site: string;
	color: string;
	labels: string[];
}

export interface Block {
	id: string;
	name: string;
	parent_site: string;
	sirens: Siren[];
}

export interface District {
	id: string;
	name: string;
	blocks: string[];
}

export interface Location {
	id: string;
	name: string;
	sirenCount: number;
	activeCount: number;
	warningCount: number;
	alertCount: number;
}

export interface MarkerLatLng {
	lat: number;
	lng: number;
}
