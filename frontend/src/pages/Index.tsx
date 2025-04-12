import { useData } from '../context/DataContext';

import SirenDashboard from '@/components/sirenList/SirenDashboard';

const Index = () => {
	const { districts, sirens, loading, error } = useData();

	if (loading) return <div className='flex items-center justify-center h-screen'>Loading...</div>;
	if (error)
		return (
			<div className='flex items-center justify-center h-screen text-red-500'>Error: {error}</div>
		);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-500';
			case 'warning':
				return 'bg-yellow-500';
			case 'alert':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	};

	return (
		<div className='p-4 space-y-6'>
			<SirenDashboard sirens={districts} />
		</div>
	);
};

export default Index;
