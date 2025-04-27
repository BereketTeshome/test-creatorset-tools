import { TextStylingSettings } from "@/components/typings/text-styling-settings";

let fadeInDuration = 1; // 1 second
let fadeOutDuration = 1; // 1 second

let drawOneLineSubtitlePrevIndex: number = -1;

export const drawSubtitleFrame = (params: {
  subtitles: any[];
  isPreview: boolean;
  currentTime;
  ctx;
  canvas;
  textStylingSettings: TextStylingSettings;
  scaleFactor;
  isPaidUser?;
}) => {
  const {
    subtitles,
    isPreview,
    currentTime,
    ctx,
    canvas,
    textStylingSettings,
    scaleFactor,
    isPaidUser = false,
  } = params;

  // Set canvas resolution according to devicePixelRatio (dpr)
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth;
  const cssHeight = canvas.clientHeight;

  if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
    ctx.scale(dpr, dpr);
  }

  // ✅ Now do all your drawing logic
  if (textStylingSettings.textDisplayFormat === "single-word") {
    drawSingleWordFrame({
      ctx,
      textStylingSettings,
      subtitles,
      canvas,
      isPreview,
      scaleFactor,
      currentTime,
    });
  } else if (textStylingSettings.textDisplayFormat === "one-line") {
    drawLinesFrame({
      linesArrangements: [5],
      ctx,
      textStylingSettings,
      subtitles,
      canvas,
      isPreview,
      scaleFactor,
      currentTime,
    });
  } else if (textStylingSettings.textDisplayFormat === "two-lines") {
    drawLinesFrame({
      linesArrangements: [5, 3],
      ctx,
      textStylingSettings,
      subtitles,
      canvas,
      isPreview,
      scaleFactor,
      currentTime,
    });
  }

  if (!isPaidUser) {
    generateWatermark(ctx, canvas, scaleFactor, isPreview);
  }
};

const generateWatermark = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scaleFactor,
  isPreview
) => {
  // generate watermark bottom right
  const fontSize = considerScaleFactor(20, scaleFactor, isPreview); // Set the font size for the watermark
  ctx.font = `${fontSize}px Tahoma`; // Set the font style
  ctx.textAlign = "right"; // Align text to the right
  ctx.textBaseline = "bottom"; // Align text to the bottom

  const x = canvas.width - 10; // 10px padding from the right edge
  const y = canvas.height - 10; // 10px padding from the bottom edge

  drawText(ctx, {
    color: "rgba(255, 255, 255, 0.3)",
    text: "Captions by CreatorSet.com",
    posX: x,
    posY: y,
    lineWidth: 6,
  });
};

const drawLinesFrame = (params: {
  linesArrangements: number[];
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  textStylingSettings: TextStylingSettings;
  subtitles: any[];
  isPreview: boolean;
  scaleFactor: number;
  currentTime: number;
}) => {
  const {
    linesArrangements,
    ctx,
    scaleFactor,
    canvas,
    textStylingSettings,
    subtitles,
    isPreview,
    currentTime,
  } = params;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const WORDS_PER_LINES = linesArrangements.reduce((a, x) => a + x, 0); // sum

  let currentIndex = subtitles.findIndex(
    (s) => currentTime >= s.start && currentTime <= s.end
  );

  if (currentIndex === -1) {
    currentIndex = drawOneLineSubtitlePrevIndex;
  }

  if (currentIndex !== -1) {
    drawOneLineSubtitlePrevIndex = currentIndex;
    const currentLineStartingIndex =
      Math.floor(currentIndex / WORDS_PER_LINES) * WORDS_PER_LINES;
    const currentSubtitleCurrentLineIndex = currentIndex % WORDS_PER_LINES;
    let allWordsInLines = [];
    let lineStartTime: number;
    let lineEndTime: number;
    for (
      let i = currentLineStartingIndex;
      i < currentLineStartingIndex + WORDS_PER_LINES;
      i++
    ) {
      if (subtitles[i]) {
        allWordsInLines.push(subtitles[i].text);
        if (i === currentLineStartingIndex) {
          lineStartTime = subtitles[i].start;
        } else if (i === currentLineStartingIndex + WORDS_PER_LINES - 1) {
          lineEndTime = subtitles[i].end;
        }
      } else {
        lineEndTime = subtitles[i - 1].end;
        break;
      }
    }

    let opacity = 1;
    if (currentTime < lineStartTime + fadeInDuration) {
      opacity = (currentTime - lineStartTime) / fadeInDuration; // Fade in
    } else if (currentTime > lineEndTime - fadeOutDuration) {
      opacity = (lineEndTime - currentTime) / fadeOutDuration; // Fade out
    }

    console.log("opacity", opacity);

    let {
      textDisplayPosition,
      animations,
      fontSize,
      textDisplayStyle,
      fontFamily,
    } = textStylingSettings;

    const getFontSize = (fontSize: string) => {
      switch (fontSize) {
        case "small":
          return 8;
        case "medium":
          return 14;
        case "large":
          return 20;
      }
    };

    let fontSizeNum = getFontSize(fontSize);
    const bounceMultiplier = 4;
    const bounceDuration = 0.2;
    if (animations === "bounce") {
      if (opacity >= 0 && opacity < bounceDuration) {
        fontSizeNum =
          fontSizeNum +
          Math.abs(
            bounceDuration / 2 - Math.abs(opacity - bounceDuration / 2)
          ) *
            fontSizeNum *
            bounceMultiplier;
      }
    }
    const scale = textStylingSettings.textScale ?? 1;

    fontSizeNum = Math.max(
      4,
      considerScaleFactor(fontSizeNum * scale, scaleFactor, isPreview)
    );

    //
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    // ctx.scale(dpr, dpr);

    let scaledFontSize = fontSizeNum * dpr;
    ctx.font = `400 ${scaledFontSize}px '${fontFamily}', sans-serif`;
    let lineWidth = considerScaleFactor(
      fontSizeNum / 4,
      scaleFactor,
      isPreview
    );

    // ctx.font = `900 ${fontSizeNum}px ${fontFamily}`;
    ctx.textBaseline = "middle";

    const linesOfWords = getLinesOfWords(allWordsInLines, linesArrangements);
    const yStart = getSubtitlesYPosition(
      textDisplayPosition,
      canvas,
      ctx,
      linesOfWords.length
    );
    let y = yStart;
    let index = 0;

    for (const lineOfWords of linesOfWords) {
      ctx.textAlign = "left"; // Center the text horizontally
      const xStart =
        (canvas.width - ctx.measureText(lineOfWords.join(" ")).width) / 2;

      let x = xStart;

      // ctx.filter = `blur(0px)`;
      // Motion blur
      if (opacity >= 0 && opacity < bounceDuration) {
        console.log("Motion blur", opacity);
        const scale =
          1 +
          Math.abs(
            bounceDuration / 2 - Math.abs(opacity - bounceDuration / 2)
          ) *
            bounceMultiplier;
        if (scale > 0.7) {
          ctx.filter = `blur(${(scale - 1) * fontSizeNum * 0.3}px)`;
        }
      }

      if (textDisplayStyle === "word-background") {
        drawRect(ctx, {
          color: "red",
          posX: xStart,
          posY: y,
          text: lineOfWords.join(" "),
        });
      }

      lineOfWords.forEach((word) => {
        const textWidth = ctx.measureText(word).width; // Measure width of the word
        let lineWidthTemp = lineWidth;

        if (index === currentSubtitleCurrentLineIndex) {
          if (textDisplayStyle === "one-word-color") {
            // Highlighted word (with background and stroke)
            drawText(ctx, {
              color: "red",
              posX: x,
              posY: y,
              text: word,
              lineWidth,
            });
          } else if (textDisplayStyle === "one-word-background") {
            drawRect(ctx, { color: "red", posX: x, posY: y, text: word });
            drawText(ctx, { posX: x, posY: y, text: word, lineWidth });
          } else {
            if (["glow"].includes(textDisplayStyle)) {
              ctx.shadowBlur = 20; // Controls the blur of the glow
              ctx.shadowColor = "white"; // Color of the glow
              lineWidthTemp = lineWidth / 3;
            }
            drawText(ctx, {
              color: textDisplayStyle === "full-color" ? "red" : "white",
              posX: x,
              posY: y,
              text: word,
              lineWidth: lineWidthTemp,
            });
          }
        } else {
          if (["glow"].includes(textDisplayStyle)) {
            ctx.shadowBlur = 20; // Controls the blur of the glow
            ctx.shadowColor = "white"; // Color of the glow
            lineWidthTemp = lineWidth / 3;
          }
          drawText(ctx, {
            color: textDisplayStyle === "full-color" ? "red" : "white",
            posX: x,
            posY: y,
            text: word,
            lineWidth: lineWidthTemp,
          });
        }

        resetContext(ctx);

        // Update x-coordinate for next word (add space between words)
        x += textWidth + ctx.measureText(" ").width;
        index++;
      });
      y += getFontHeight(ctx);

      // // Motion blur
      // if (opacity < 0.07) {
      //   // console.log("Motion blur", opacity)
      //   // ctx.filter = `blur(${(opacity / 0.07) * 3}px)`
      //   const lineOfWordsWidth = ctx.measureText(lineOfWords.join(" ")).width;
      //   // Create radial blur gradient over the text
      //   let gradient = ctx.createRadialGradient(xStart, yStart, 0, xStart + lineOfWordsWidth, y, lineOfWordsWidth);
      //   gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      //   gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity / 0.07})`);
      //
      //   ctx.globalCompositeOperation = "source-atop"; // Apply gradient only to text
      //   ctx.fillStyle = gradient;
      //   ctx.fillRect(0, 0, canvas.width, canvas.height);
      //
      //   // Reset global composite operation to default
      //   ctx.globalCompositeOperation = "source-over";
      //
      // }
    }
  }
};

const drawSingleWordFrame = (params: {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  textStylingSettings: TextStylingSettings;
  subtitles: any[];
  isPreview: boolean;
  scaleFactor: number;
  currentTime: number;
}) => {
  const {
    ctx,
    scaleFactor,
    canvas,
    textStylingSettings,
    subtitles,
    isPreview,
    currentTime,
  } = params;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const subtitle = subtitles.find(
    (s) => currentTime >= s.start && currentTime <= s.end
  );

  if (subtitle) {
    let opacity = 1;
    if (currentTime < subtitle.start + fadeInDuration) {
      opacity = (currentTime - subtitle.start) / fadeInDuration; // Fade in
    } else if (currentTime > subtitle.end - fadeOutDuration) {
      opacity = (subtitle.end - currentTime) / fadeOutDuration; // Fade out
    }

    let {
      textDisplayPosition,
      animations,
      fontSize,
      textDisplayStyle,
      fontFamily,
    } = textStylingSettings;

    const getFontSize = (fontSize: string) => {
      switch (fontSize) {
        case "small":
          return 14;
        case "medium":
          return 20;
        case "large":
          return 30;
      }
    };

    let fontSizeNum = getFontSize(fontSize);

    if (animations === "bounce") {
      const bounceMultiplier = 1;
      const bounceDuration = 0.2;
      if (opacity >= 0 && opacity < bounceDuration) {
        fontSizeNum =
          fontSizeNum +
          Math.abs(
            bounceDuration / 2 - Math.abs(opacity - bounceDuration / 2)
          ) *
            fontSizeNum *
            bounceMultiplier;
      }

      ctx.filter = `blur(0px)`;
      // Motion blur
      if (opacity >= 0 && opacity < bounceDuration) {
        console.log("Motion blur", opacity);
        const scale =
          1 +
          Math.abs(
            bounceDuration / 2 - Math.abs(opacity - bounceDuration / 2)
          ) *
            bounceMultiplier;
        if (scale > 0.7) {
          ctx.filter = `blur(${(scale - 1) * fontSizeNum * 0.5}px)`;
        }
      }
    }
    if (animations === "zoom") {
      const zoomDuration = 0.4;
      const zoomStrength = 0.1; // reduced zoom for smoother effect

      if (opacity >= 0 && opacity < zoomDuration) {
        const zoomProgress = opacity / zoomDuration;
        const ease = 1 - Math.pow(1 - zoomProgress, 3); // ease-out cubic

        const scale = 1 + zoomStrength * ease;
        fontSizeNum *= scale * 0.9; // scaled down font size slightly overall
      } else {
        fontSizeNum *= 0.9; // keep base size a bit smaller when static
      }

      ctx.filter = "none"; // no blur
    }

    fontSizeNum = considerScaleFactor(fontSizeNum, scaleFactor, isPreview);

    ctx.font = `400 ${fontSizeNum}px ${fontFamily}`;
    ctx.textAlign = "center"; // Center the text horizontally
    let lineWidth = considerScaleFactor(
      fontSizeNum / 20 + 3,
      scaleFactor,
      isPreview
    );
    const posX = canvas.width / 2;
    const posY = getSubtitlesYPosition(textDisplayPosition, canvas, ctx);
    if (["one-word-background", "word-background"].includes(textDisplayStyle)) {
      const textWidth = ctx.measureText(subtitle.text).width; // Measure width of the word
      drawRect(ctx, {
        color: "red",
        posX: posX - textWidth / 2,
        posY,
        text: subtitle.text,
      });
    }
    if (["glow"].includes(textDisplayStyle)) {
      ctx.shadowBlur = 10; // Controls the blur of the glow
      ctx.shadowColor = "white"; // Color of the glow
      lineWidth = lineWidth / 6;
    }
    drawText(ctx, {
      color: ["full-color", "one-word-color"].includes(textDisplayStyle)
        ? "red"
        : "white",
      posX,
      posY,
      text: subtitle.text,
      lineWidth,
    });
    resetContext(ctx);
  }
};

const considerScaleFactor = (
  value: number,
  scaleFactor: number,
  isPreview: boolean
) => {
  if (!isPreview) {
    return value / scaleFactor;
  }
  return value;
};

const getSubtitlesYPosition = (
  textDisplayPosition: "bottom" | "top" | "center",
  canvas,
  ctx: CanvasRenderingContext2D,
  noOfLines = 1
) => {
  const OFFSET_PX =
    getFontHeight(ctx) * 0.8 + (noOfLines - 1) * getFontHeight(ctx);
  if (textDisplayPosition === "bottom") {
    return canvas.height - OFFSET_PX - 60;
  } else if (textDisplayPosition === "top") {
    return OFFSET_PX + 60;
  } else {
    return canvas.height / 2;
  }
};

const getSubtitlesBaseline = (
  textDisplayPosition: "bottom" | "top" | "center"
) => {
  if (textDisplayPosition === "bottom") {
    return "bottom";
  } else if (textDisplayPosition === "top") {
    return "top";
  } else {
    return "middle";
  }
};

const drawText = (
  ctx: CanvasRenderingContext2D,
  { color = "white", text, posX, posY, lineWidth }
) => {
  ctx.fillStyle = color; // Background color
  ctx.lineWidth = lineWidth;
  ctx.strokeText(text, posX, posY); // Draw stroke text
  ctx.fillText(text, posX, posY);
};

const resetContext = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowBlur = 0;
  ctx.shadowColor = null;
};

const drawRect = (
  ctx: CanvasRenderingContext2D,
  { color, text, posX, posY }
) => {
  const textWidth = ctx.measureText(text).width; // Measure width of the word
  const fontHeight = getFontHeight(ctx);
  const padding = fontHeight / 3;
  ctx.fillStyle = color; // Background color
  ctx.fillRect(
    posX - padding,
    posY - padding * 2,
    textWidth + padding * 2,
    fontHeight + padding
  ); // Draw background
};

const getFontHeight = (ctx: CanvasRenderingContext2D) => {
  return parseInt(ctx.font.match(/(\d+(\.\d+)?)px/)[1], 10);
};

const getLinesOfWords = (
  allWordsInLines: string[],
  linesArrangements: number[]
): string[][] => {
  const result = [];
  let currentIndex = 0;
  for (const lineArrangement of linesArrangements) {
    let temp = [];
    for (let i = 0; i < lineArrangement; i++) {
      const word = allWordsInLines[currentIndex++];
      if (word) {
        temp.push(word);
      } else {
        break;
      }
    }
    result.push(temp);
  }
  return result;
};
