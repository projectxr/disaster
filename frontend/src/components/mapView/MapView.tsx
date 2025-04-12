import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Siren, MarkerLatLng } from '@/types';
import SirenStatusBadge from '../sirenList/SirenStatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ChevronDown, MapPin, Map } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import SirenMarker from './SirenMarker';
import { DefaultZoomButton } from './MapElements';
import { GeoJSONLayer } from './GeoJSONLayer';
import stateData from './states.json';

// Make sure to import this CSS for proper map display
import { useEffect as useEffectOnce } from 'react';

interface MapViewProps {
	sirens: Siren[];
}

const MapView: React.FC<MapViewProps> = ({ sirens }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSiren, setSelectedSiren] = useState<Siren | null>(null);
	const [statusFilter, setStatusFilter] = useState<string[]>([
		'active',
		'warning',
		'alert',
		'inactive',
	]);

	const mapSirens = sirens.map(siren => {
		const status = siren.status;
		let color = '#666666';

		if (status === 'active') color = '#10B981';
		if (status === 'warning') color = '#F59E0B';
		if (status === 'alert') color = '#EF4444';

		return {
			...siren,
			color,
			latitude: siren.latitude || parseFloat(Math.random() * 10 + 15).toFixed(6),
			longitude: siren.longitude || parseFloat(Math.random() * 15 + 70).toFixed(6),
		};
	});

	const filteredSirens = mapSirens.filter(siren => {
		const matchesSearch = siren.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter.includes(siren.status);
		return matchesSearch && matchesStatus;
	});

	const handleStatusFilterChange = (status: string) => {
		setStatusFilter(prev => {
			if (prev.includes(status)) {
				return prev.filter(s => s !== status);
			} else {
				return [...prev, status];
			}
		});
	};

	const handleMarkerClick = (siren: Siren) => {
		setSelectedSiren(siren);
	};
	useEffectOnce(() => {
		// Fix Leaflet icon issues in production build
		import('leaflet').then(L => {
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: '/marker-icon-2x.png',
				iconUrl: '/marker-icon.png',
				shadowUrl: '/marker-shadow.png',
			});
		});
	}, []);

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-4 h-full'>
			<div className='lg:col-span-3'>
				<Card className='h-full bg-industrial-dark border-industrial-steel/30'>
					<CardHeader className='pb-2 flex flex-row justify-between items-center'>
						<CardTitle className='text-lg font-medium'>Geographic Map View</CardTitle>
						<div className='flex gap-2'>
							<Button variant='outline' className='text-xs h-8 border-industrial-steel/50'>
								<Map className='h-3.5 w-3.5 mr-1' />
								Satellite
							</Button>
							<Button variant='outline' className='text-xs h-8 border-industrial-steel/50'>
								<MapPin className='h-3.5 w-3.5 mr-1' />
								Center Map
							</Button>
						</div>
					</CardHeader>
					<CardContent className='h-[calc(100%-70px)] relative p-0'>
						<MapContainer
							style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
							center={[20.2961, 85.8245]}
							zoom={8}
							minZoom={4}
							attributionControl={false}
							maxZoom={18}
							scrollWheelZoom={true}
							maxBounds={new LatLngBounds([6.75, 68.1], [35.5, 97.4])}
							maxBoundsViscosity={1.0}
						>
							<TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
							<LayersControl position='topright'>
								<LayersControl.Overlay checked name='Sirens'>
									<MarkerClusterGroup chunkedLoading>
										{filteredSirens.map((siren, index) => (
											<SirenMarker
												key={index}
												index={index}
												siren={siren as any}
												color={siren.color || '#666666'}
												playing={siren.playing || false}
											/>
										))}
									</MarkerClusterGroup>
								</LayersControl.Overlay>
								<LayersControl.Overlay checked name='States'>
									<GeoJSONLayer
										geoData={stateData}
										dataParams={[{ param: 'ST_NM', title: 'State' }]}
									/>
								</LayersControl.Overlay>
							</LayersControl>
							<DefaultZoomButton position='topleft' />
						</MapContainer>

						{/* Siren popup when selected */}
						{selectedSiren && (
							<div className='absolute right-4 bottom-4 w-64'>
								<Card className='bg-industrial-dark border-industrial-steel/50'>
									<CardHeader className='pb-1 pt-2 flex flex-row justify-between items-center'>
										<CardTitle className='text-sm font-medium'>{selectedSiren.name}</CardTitle>
										<Button
											variant='ghost'
											size='icon'
											className='h-6 w-6'
											onClick={() => setSelectedSiren(null)}
										>
											✕
										</Button>
									</CardHeader>
									<CardContent className='pt-2 pb-3 space-y-1'>
										<div className='flex justify-between text-sm'>
											<span className='text-gray-400'>Status:</span>
											<SirenStatusBadge status={selectedSiren.status} />
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-gray-400'>Type:</span>
											<span>{selectedSiren.type.join(', ')}</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-gray-400'>Location:</span>
											<span>{selectedSiren.location}</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-gray-400'>Last Checked:</span>
											<span>{new Date(selectedSiren.lastChecked).toLocaleTimeString()}</span>
										</div>
										<div className='pt-2 grid grid-cols-2 gap-2'>
											<Button
												variant='outline'
												size='sm'
												className='border-industrial-steel/50 text-xs h-8'
											>
												Test Siren
											</Button>
											<Button
												variant='outline'
												size='sm'
												className='border-industrial-steel/50 text-xs h-8'
											>
												View Details
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<div>
				<Card className='h-full overflow-hidden flex flex-col bg-industrial-dark border-industrial-steel/30'>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium'>Siren Locations</CardTitle>
						<div className='relative mt-2'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
							<Input
								placeholder='Search locations...'
								className='pl-10 bg-industrial-dark border-industrial-steel/50 text-sm'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className='flex justify-between items-center mt-2'>
							<span className='text-xs text-gray-400'>{filteredSirens.length} sirens</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='outline'
										size='sm'
										className='h-7 text-xs border-industrial-steel/50'
									>
										<Filter className='h-3 w-3 mr-1' />
										Filter
										<ChevronDown className='h-3 w-3 ml-1' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='bg-industrial-dark border-industrial-steel/50'>
									<DropdownMenuCheckboxItem
										checked={statusFilter.includes('active')}
										onCheckedChange={() => handleStatusFilterChange('active')}
									>
										Active Sirens
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={statusFilter.includes('warning')}
										onCheckedChange={() => handleStatusFilterChange('warning')}
									>
										Warning Status
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={statusFilter.includes('alert')}
										onCheckedChange={() => handleStatusFilterChange('alert')}
									>
										Alert Status
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={statusFilter.includes('inactive')}
										onCheckedChange={() => handleStatusFilterChange('inactive')}
									>
										Inactive Sirens
									</DropdownMenuCheckboxItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</CardHeader>
					<CardContent className='py-0 overflow-auto flex-1'>
						<div className='space-y-1 py-2'>
							{filteredSirens.map(siren => (
								<div
									key={siren.id}
									onClick={() => setSelectedSiren(siren)}
									className={`p-2 rounded-md flex items-center justify-between cursor-pointer transition-colors
                              ${
																selectedSiren?.id === siren.id
																	? 'bg-industrial-steel/40'
																	: 'hover:bg-industrial-steel/20'
															}`}
								>
									<div className='flex items-center'>
										<div
											className={`h-3 w-3 rounded-full mr-2
                                    ${
																			siren.status === 'active'
																				? 'bg-green-500'
																				: siren.status === 'warning'
																				? 'bg-yellow-500'
																				: siren.status === 'alert'
																				? 'bg-red-500'
																				: 'bg-gray-500'
																		}`}
										></div>
										<span className='text-sm'>{siren.name}</span>
									</div>
									<span className='text-xs text-gray-400'>{siren.type.join(', ')}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default MapView;
