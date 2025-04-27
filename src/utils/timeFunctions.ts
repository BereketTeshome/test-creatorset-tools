export const ifSingleDigitPrependZero = (number) => {
	if (number >= 0 && number <= 9) {
		return (number = `0${number}`);
	}
	return number;
};

export const timeStringToMinutesAndSeconds = (string) => {
	let minutes = '';
	let seconds = '';
	let haveReachedColon = false;

	for (let index = 0; index < string.length; index++) {
		const e = string[index];
		if (e === ':') haveReachedColon = true;
		if (haveReachedColon && e !== ':') seconds = seconds + e;
		if (!haveReachedColon && e !== ':') minutes = minutes + e;
	}

	return { minutes, seconds };
};

export const secondsToMinutes = (inputSeconds) => {
	let minutes = ifSingleDigitPrependZero(Math.floor(inputSeconds / 60));
	let seconds = ifSingleDigitPrependZero(Math.floor(inputSeconds - minutes * 60));
	return `${minutes}:${seconds}`;
};
export function secondsToHour(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor((d % 3600) / 60);
	var s = Math.floor((d % 3600) % 60);

	return `${ifSingleDigitPrependZero(h)}:${ifSingleDigitPrependZero(m)}:${ifSingleDigitPrependZero(s)}`;
}

export const minutesToSeconds = (timeString) => {
	let { minutes, seconds } = timeStringToMinutesAndSeconds(timeString);
	const resultMinutesInSeconds = parseInt(minutes) * 60;
	const resultSeconds = parseInt(seconds);
	const result = resultMinutesInSeconds + resultSeconds;
	return result;
};

export const validateTimeString = (string, length = 0) => {
	if (string.length > 5 || string.length < 4) return false;
	if (!string.includes(':')) return false;

	const { minutes, seconds } = timeStringToMinutesAndSeconds(string);

	if (/[^0-9]/.test(minutes) || /[^0-9]/.test(seconds)) return false;
	if (Number(minutes[0]) > 5 || Number(seconds[0]) > 5) return false;
	if (seconds.length !== 2) return false;

	if (length !== 0) {
		const inputInSeconds = minutesToSeconds(string);
		return inputInSeconds <= length;
	}

	return true;
};

export const timeToBarPercentage = (timeInSeconds, lengthInSeconds) => {
	return (timeInSeconds * 99) / lengthInSeconds;
};


export const formatTime = (timeInSeconds: number): string => {
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = Math.floor(timeInSeconds % 60);
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
};
