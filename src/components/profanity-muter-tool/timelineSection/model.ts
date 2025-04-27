import {Caption} from "@/components/typings/caption";
import {deleteElementFromArr, replaceArrayElement} from "@/utils/generalFunctions";

export const updateOrDeleteWord =
	(
		captionIndex: number,
		wordIndex: number,
		captionsArray: Caption[],
		setCaptionsArray: (value: Caption[]) => void
	) =>
	(value: string) =>
	() => {
		let newContentString = '';
		const wordsArray = captionsArray[captionIndex].text.split(' ');

		if (value !== '') {
			const newWordsArray = replaceArrayElement(wordsArray, wordIndex, value);
			newContentString = newWordsArray.join(' ');
		} else {
			const newWordsArray = deleteElementFromArr(wordsArray, wordIndex);
			newContentString = newWordsArray.join(' ');
		}

		const result: Caption[] = replaceArrayElement(captionsArray, captionIndex, {
			start: captionsArray[captionIndex].start,
			end: captionsArray[captionIndex].end,
			text: newContentString,
			profanity: captionsArray[captionIndex].profanity,
		});
		setCaptionsArray(result);
	};


export const updateProfaneValue=
	(
		captionIndex: number,
		wordIndex: number,
		captionsArray: Caption[],
		setCaptionsArray: (value: Caption[]) => void
	) =>
	(value: boolean) =>
	() => {
		const result: Caption[] = replaceArrayElement(captionsArray, captionIndex, {
			start: captionsArray[captionIndex].start,
			end: captionsArray[captionIndex].end,
			text: captionsArray[captionIndex].text,
			profanity: value,
		});
		setCaptionsArray(result);
	};
