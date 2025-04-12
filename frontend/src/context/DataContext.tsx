import React, { createContext, useContext, useState, useEffect } from 'react';
import { District, Siren } from '../types';
import * as api from '../services/api';

interface DataContextType {
	districts: District[];
	sirens: Siren[];
	loading: boolean;
	error: string | null;
	refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [districts, setDistricts] = useState<District[]>([]);
	const [sirens, setSirens] = useState<Siren[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refreshData = async () => {
		try {
			setLoading(true);
			const [districtsData, sirensData] = await Promise.all([api.getDistricts(), api.getSirens()]);
			setDistricts(districtsData);
			setSirens(sirensData);
			setError(null);
		} catch (err) {
			setError('Failed to fetch data');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshData();
	}, []);

	return (
		<DataContext.Provider value={{ districts, sirens, loading, error, refreshData }}>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => {
	const context = useContext(DataContext);
	if (context === undefined) {
		throw new Error('useData must be used within a DataProvider');
	}
	return context;
};
