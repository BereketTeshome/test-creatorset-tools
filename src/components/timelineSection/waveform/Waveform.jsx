import * as React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import LoadingIndicator from './LoadingIndicator';
import { motion as m } from 'framer-motion';
import {SECONDS_TO_REM_CONSTANT} from "@/components/timelineSection/timeTracker/TimeTracker";

const Waveform = ({ width, progressColor, waveColor, isPlaying, src, onMouseDown }) => {
	const wavesurferRef = React.useRef(null);
	const REM_TO_PIXEL = 16;
	const [wavesurferObj, setWavesurferObj] = useState();
	const [loadingPercentage, setLoadingPercentage] = useState(0);
	//Derived state
	let isWaveFormLoaded = loadingPercentage === 100;

	useEffect(() => {
		if (wavesurferRef.current && !wavesurferObj) {
			setWavesurferObj(
				WaveSurfer.create({
					container: wavesurferRef.current,
					barWidth: 2,
					waveColor,
					progressColor,
					cusrorColor: '#2B2B2B',
					interact: false,
					barHeight: 1, // the height of the wave
					barGap: null, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
					scrollParent: false,
					fillParent: true,
					responsive: true,
					minPxPerSec: SECONDS_TO_REM_CONSTANT * REM_TO_PIXEL,
					partialRender: true,
				})
			);
		}
	}, [wavesurferRef, wavesurferObj]);

	useEffect(() => {
		if (wavesurferObj) {
			wavesurferObj.load(src);
			wavesurferObj.on('loading', function (percent) {
				setLoadingPercentage(parseInt(percent));
			});
			wavesurferObj.on('ready', function () {
				wavesurferObj.setCursorColor('rgba(255, 255, 255, 0)');
				wavesurferObj.setMute(true);
				// setIsWaveformLoaded(true);
				wavesurferObj.drawBuffer();
			});
		}
	}, [wavesurferObj]);

	useEffect(() => {
		if (wavesurferObj) {
			isPlaying ? wavesurferObj.play() : wavesurferObj.pause();
		}
	}, [isPlaying, wavesurferObj]);

	const getWidth = () => {
		return isWaveFormLoaded ? width : '100%';
	};

	return (
		<div style={{ height: '50%', width: getWidth(), padding: '1rem 0rem', position: 'relative', cursor: 'pointer' }} onMouseDown={onMouseDown}>
			{!isWaveFormLoaded && <LoadingIndicator loadingPercentage={loadingPercentage} />}
			<m.div
				animate={{ opacity: isWaveFormLoaded ? 1 : 0, y: isWaveFormLoaded ? 0 : 50 }}
				ref={wavesurferRef}
				className='WF_Component'></m.div>
		</div>
	);
};

Waveform.defaultProps = {
	progressColor: '#f41c3b',
	waveColor: '#aaaaaa',
	isPlaying: false,
};

Waveform.propTypes = {
	isPlaying: PropTypes.bool,
	volume: PropTypes.number,
	width: PropTypes.string,
	progressColor: PropTypes.string,
	waveColor: PropTypes.string,
	src: PropTypes.string,
};

export default Waveform;
