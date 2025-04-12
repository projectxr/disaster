import { GeoJSON } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import { Feature } from 'geojson';

interface DataParamI {
	param: string;
	title: string;
}

export const GeoJSONLayer: React.FC<{
	geoData: any;
	dataParams: DataParamI[];
}> = ({ geoData, dataParams }) => {
	const map = useMap();

	const defaultStyle = {
		fillColor: '#1a1a1a',
		fillOpacity: 0.2,
		color: '#4a4a4a',
		weight: 1,
	};

	const hoverStyle = {
		fillColor: '#2a2a2a',
		fillOpacity: 0.4,
		color: '#6a6a6a',
		weight: 2,
	};

	return (
		<GeoJSON
			style={defaultStyle}
			onEachFeature={(feature: Feature, layer) => {
				layer.on('click', eve => {
					if (map) {
						map.flyToBounds(eve.target.getBounds(), {
							animate: true,
							duration: 0.75,
						});
					}
				});
				layer.on('mouseover', eve => {
					eve.target.setStyle(hoverStyle);
				});
				layer.on('mouseout', eve => {
					eve.target.setStyle(defaultStyle);
				});
				const tooltipContent = () =>
					dataParams
						.map(({ title, param }) => `<strong>${title}: </strong>${feature.properties[param]}`)
						.join('<br/>');

				layer.bindTooltip(tooltipContent(), {
					className: 'custom-tooltip',
					direction: 'top',
					offset: [0, -10],
				});
			}}
			data={geoData}
		/>
	);
};
