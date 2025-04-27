export const getValuesFromObjectsArray = (arr, i = 0) => {
	let result = [];
	arr.forEach((element) => {
		let valuesArr = Object.values(element);
		result = [...result, valuesArr[i]];
	});
	return result;
};

export const checkIfObjEmpty = (obj) => {
	return Object.keys(obj).length == 0;
};

export const returnLocationState = (props) => {
	if (props && props.location && props.location.state) return props.location.state;
	return false;
};

export const shortenFileName = (fileName, desiredLength) => {
	let result = '';
	let isExtension = false;
	for (let i = 0; i != fileName.length; i++) {
		if (fileName[i] === '.') {
			isExtension = true;
			result += '...';
		}
		if (isExtension == false && i < desiredLength) {
			result += fileName[i];
		}
		if (isExtension == true) result += fileName[i];
	}
	return result;
};
export const shortenString = (string, desiredLength) => {
	let result = '';
	for (let i = 0; i != string.length; i++) {
		if (i < desiredLength - 3) {
			result += string[i];
		}
	}
	if (string.length <= desiredLength) return string;
	return `${result}...`;
};

export const deleteElementFromArr = (arr, index) => {
	const result = [...arr];
	result.splice(index, 1);
	return [...result];
};

export const replaceArrayElement = (array, index, value) => {
	const result = [...array];
	result[index] = value;
	return [...result];
};

export const pushElementToArray = (array, element) => {
	const result = [...array];
	result.push(element);
	return [...result];
};

export const insertElementIntoArray = (array, element, index) => {
	const result = [...array];
	result.splice(index, 0, element);
	return [...result];
};

export const replaceObjectElement = (obj, key, value) => {
	const result = obj;
	result[key] = value;
	return result;
};

export const shuffleArray = (array) => {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

export const mockApiCall = () => {
	return new Promise((resolve, reject) => {
		setTimeout(function () {
			if (Math.random() >= 0.5) resolve('RESOLVED');
			else {
				reject('REJECTED');
			}
		}, 2000);
	});
};
export function chunkArray(arr, n) {
	var chunkLength = Math.max(arr.length / n, 1);
	var chunks = [];
	for (var i = 0; i < n; i++) {
		if (chunkLength * (i + 1) <= arr.length) chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
	}
	return chunks;
}

export const calculateCreditUsagePercentage = (totalCredit: number, totalDeductedCredit) => {
	if (totalCredit === 0) {
	  return 0;
	}
	if (totalDeductedCredit === 0) {
	  return 100;
	}
	return (totalDeductedCredit / totalCredit) * 100;
  };

  export  const calculateDeductedPercentage = (totalCredit: number, totalDeductedCredit: number) => {
    if (totalCredit === 0) {
      return 0; // Avoid division by zero if totalCredit is 0
    }
    return (totalDeductedCredit / totalCredit) * 100;
  };