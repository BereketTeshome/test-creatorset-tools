export const processTranscriptionItems = (items: any[]) => {
  let processedItems: any[] = [];
  let currentItem: { alternatives: any; start_time?: any; end_time?: any; } | null = null;

  items.forEach((item, index) => {
    if (item.type === "pronunciation") {
      // If there's a current item, push it to the processed items
      if (currentItem) {
        processedItems.push(currentItem);
      }
      // Start a new item
      currentItem = {
        start_time: item.start_time,
        end_time: item.end_time,
        alternatives: [
          {
            confidence: item.alternatives[0].confidence,
            content: item.alternatives[0].content,
          },
        ],
      };
    } else if (item.type === "punctuation" && currentItem) {
      // Append punctuation to the current item's content
      currentItem.alternatives[0].content += item.alternatives[0].content;
      // Update the end time if this is the last item
      if (index === items.length - 1) {
        processedItems.push(currentItem);
      }
    }
  });

  // Push the last item if it exists and wasn't pushed
  if (
    currentItem &&
    processedItems[processedItems.length - 1] !== currentItem
  ) {
    processedItems.push(currentItem);
  }

  return processedItems;
};
