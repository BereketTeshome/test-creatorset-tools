// @ts-nocheck
export const transcriptionCleaner = (transcription) => {
  transcription?.results?.items?.forEach((item, index) => {
    if (!item?.start_time) {
      const prevItem = transcription.results.items[index - 1];
      if (prevItem) {
        prevItem.alternatives[0].content += item.alternatives[0].content;
      }
    }
  });

  // Filter out the items without a start_time
  const formattedTranscripts = transcription?.results?.items
    ?.filter((item) => item.start_time)
    ?.map((item) => ({
      start_time: item?.start_time,
      end_time: item?.end_time,
      content: item?.alternatives?.[0]?.content,
    }));
  return formattedTranscripts;
};
