import React from 'react';
import { useData } from '../context/DataContext';
import MapView from '@/components/mapView/MapView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

const MapPage = () => {
	const { districts, sirens, loading, error } = useData();

	if (loading) return <div className='flex items-center justify-center h-screen'>Loading...</div>;
	if (error)
		return (
			<div className='flex items-center justify-center h-screen text-red-500'>Error: {error}</div>
		);

	const stats = {
		total: sirens.length,
		active: sirens.filter(s => s.status === 'active').length,
		warning: sirens.filter(s => s.status === 'warning').length,
		alert: sirens.filter(s => s.status === 'alert').length,
	};

	return (
		<div className='p-4 space-y-4'>
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Sirens</CardTitle>
						<Clock className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Active</CardTitle>
						<CheckCircle2 className='h-4 w-4 text-green-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.active}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Warning</CardTitle>
						<AlertCircle className='h-4 w-4 text-yellow-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.warning}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Alert</CardTitle>
						<XCircle className='h-4 w-4 text-red-500' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{stats.alert}</div>
					</CardContent>
				</Card>
			</div>
			<MapView sirens={sirens} />
		</div>
	);
};

export default MapPage;
