import * as React from 'react';
import { motion as m } from 'framer-motion';

const LoadingIndicator = ({ loadingPercentage }: { loadingPercentage: number }) => {
	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			style={{
				left: `${window.innerWidth / 3}px`,
				position: 'absolute',
				height: '100%',
				aspectRatio: '3/1',
				borderRadius: '50%',
				display: 'flex',
				alignItems: 'center',
			}}>
			<div style={{ height: '40%', width: '100%' }}>
				<m.div
					animate={{ width: `${loadingPercentage}%` }}
					style={{ height: '32%', backgroundColor: '#F41D3B', borderRadius: '10px' }}></m.div>
			</div>
		</m.div>
	);
};

export default LoadingIndicator;
