// @ts-nocheck
const transcriptionItemsToSrt = (items) => {
  let srt = "";
  let i = 1;
  let lastValidEndTime = "00:00:00,000";

  items.forEach((item, index) => {
    // Skip items without content (e.g., some punctuation items)
    if (!item.alternatives?.[0]?.content) return;

    const content = item.alternatives[0].content;

    // For items without timestamps (like punctuation), attach to the previous item
    if (!item.start_time || !item.end_time) {
      // Append to the previous subtitle if it exists
      if (srt.length > 0) {
        const lastNewlineIndex = srt.lastIndexOf("\n\n");
        if (lastNewlineIndex !== -1) {
          srt =
            srt.slice(0, lastNewlineIndex) +
            content +
            srt.slice(lastNewlineIndex);
        }
      }
      return;
    }

    // sequence
    srt += i + "\n";

    // timestamps
    const startTime = timeConverterForSrt(item.start_time);
    const endTime = timeConverterForSrt(item.end_time);
    srt += startTime + " --> " + endTime + "\n";

    // content
    srt += content + "\n\n";

    lastValidEndTime = endTime;
    i++;
  });

  return srt;
};

const timeConverterForSrt = (time) => {
  if (!time) return "00:00:00,000";
  const newTime = new Date(parseFloat(time) * 1000)
    .toISOString()
    .slice(11, 23)
    .replace(".", ",");
  return newTime;
};

export default transcriptionItemsToSrt;
