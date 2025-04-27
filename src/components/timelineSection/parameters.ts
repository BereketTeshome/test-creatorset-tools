export const AVERAGE_CAPTION_DURATION = 0.3; //seconds
export const AVERAGE_TIME_BETWEEN_CAPTIONS = 0.03; //seconds

export const defaultCaptionValue = {
	start: 0,
	end: 0,
	text: 'content',
	profanity: false,
};

// For version 2 this constant could be calculated using the average
// words per minute of the video. But first we should create a graph that
// correlates w.p.m to lenght (posiblly linear?)
export const SECONDS_TO_REM_CONSTANT = 15; //rem;
export const PIXELS_TO_SECONDS_CONSTANT = 1 / 240; //seconds
export const REMS_TO_PIXELS = 16;
