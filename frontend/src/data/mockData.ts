import { Location, SirenType } from '../types';

export interface District {
	id: string;
	name: string;
	blocks: Block[];
}

export interface Block {
	id: string;
	name: string;
	parent_site: string;
	sirens: Siren[];
}

export interface Siren {
	id: string;
	name: string;
	type: SirenType[];
	location: string;
	status: 'active' | 'inactive' | 'warning' | 'alert';
	lastChecked: string;
	latitude: number;
	longitude: number;
}

export const sirens: District[] = [
	{
		id: 'd001',
		name: 'Balasore',
		blocks: [
			{
				id: 'b001',
				name: 'Baliapal',
				parent_site: 'Baliapal',
				sirens: [
					{
						id: 's001',
						name: 'Balihil',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T08:30:00',
						latitude: 21.4934,
						longitude: 86.9465,
					},
					{
						id: 's002',
						name: 'Jambhirai',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T08:15:00',
						latitude: 21.5023,
						longitude: 87.0123,
					},
					{
						id: 's003',
						name: 'Narayanpur',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T07:45:00',
						latitude: 21.5234,
						longitude: 87.0345,
					},
					{
						id: 's004',
						name: 'Jamunashul',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T08:20:00',
						latitude: 21.5123,
						longitude: 87.0223,
					},
				],
			},
			{
				id: 'b002',
				name: 'Bahanaga',
				parent_site: 'Bahanaga',
				sirens: [
					{
						id: 's005',
						name: 'Villa',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T06:10:00',
						latitude: 21.4245,
						longitude: 86.8765,
					},
					{
						id: 's006',
						name: 'Anapur',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T08:25:00',
						latitude: 21.4356,
						longitude: 86.8876,
					},
					{
						id: 's007',
						name: 'Rupakhanda',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T08:22:00',
						latitude: 21.4467,
						longitude: 86.8987,
					},
					{
						id: 's008',
						name: 'Barjadoali',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'inactive',
						lastChecked: '2025-04-12T08:05:00',
						latitude: 21.4578,
						longitude: 86.9098,
					},
					{
						id: 's009',
						name: 'Routpada',
						type: ['GPRS', 'Ethernet'],
						location: 'Odisha',
						status: 'active',
						lastChecked: '2025-04-12T08:18:00',
						latitude: 21.4689,
						longitude: 86.9109,
					},
				],
			},
		],
	},
	{
		id: 'd002',
		name: 'Ganjam',
		blocks: [],
	},
	{
		id: 'd003',
		name: 'Puri',
		blocks: [],
	},
	{
		id: 'd004',
		name: 'Kendrapara',
		blocks: [],
	},
	{
		id: 'd005',
		name: 'Jagatsingpur',
		blocks: [],
	},
	{
		id: 'd006',
		name: 'Bhadrak',
		blocks: [],
	},
];

// Mock location data
export const locations: Location[] = [
	{
		id: 'l1',
		name: 'Odisha',
		sirenCount: 122,
		activeCount: 98,
		warningCount: 18,
		alertCount: 6,
	},
	{
		id: 'l2',
		name: 'Dishar',
		sirenCount: 6,
		activeCount: 4,
		warningCount: 1,
		alertCount: 1,
	},
	{
		id: 'l3',
		name: 'SEOC',
		sirenCount: 22,
		activeCount: 20,
		warningCount: 2,
		alertCount: 0,
	},
];
