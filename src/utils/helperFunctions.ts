export const updateTextInput = (fn: (value: string) => void) => (e: { target: { value: string } }) => {
	fn(e.target.value);
};

export const openModal = (setter: (value: boolean) => void) => () => {
	setter(true);
};

export const closeModal = (setter: (value: boolean) => void) => () => {
	setter(false);
};

export const areObjectsEqual = (objA: { [key: string]: any }, objB: { [key: string]: any }) => {
	return JSON.stringify(objA) === JSON.stringify(objB);
};

export const onEnterLooseFocus = (e: any) => {
	if (e.key === 'Enter') {
		e.target.blur();
	}
};

export const replaceElementByKey = (obj: any, key: string, value: any) => {
	const result = { ...obj };
	result[key] = value;
	return { ...result };
};
