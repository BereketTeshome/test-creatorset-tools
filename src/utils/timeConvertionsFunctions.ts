import { ifSingleDigitPrependZero } from './timeFunctions';

export const timeStringRegEx =
	/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-9][0-9][0-9])?$/;

export const secondsToMilliseconds = (timeInput: number) => {
	const milliseconds = timeInput.toFixed(3).slice(-3);
	let minutes = ifSingleDigitPrependZero(Math.floor(timeInput / 60));
	let seconds = ifSingleDigitPrependZero(Math.floor(timeInput - minutes * 60));
	return {
		number: timeInput,
		string: `${minutes}:${seconds}:${milliseconds}`,
	};
};

export const millisecondStringToSeconds = (timeString: string) => {
	const num = timeString.split(':');
	const integerPart = String(parseInt(num[0]) * 60 + parseInt(num[1]));
	const floatPart = '.' + String(num[2]);
	return parseFloat(integerPart + floatPart);
};
