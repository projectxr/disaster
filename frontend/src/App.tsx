import React from 'react';
import { DataProvider } from './context/DataContext';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
	return (
		<Router>
			<DataProvider>
				<AppRoutes />
			</DataProvider>
		</Router>
	);
}

export default App;
