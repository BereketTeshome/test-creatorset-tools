// "use client";
// import { useAppSelector } from "@/redux/store";
// import { motion, AnimatePresence } from "framer-motion";
// import React, {useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef} from "react";
// import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
// import {getMp4Info} from "@/lib/utils";
//
// const timeIncrement = 0.025
// const TranscribedVideoContainer = forwardRef<any, {src: string, selectedVideo: any}>(
//     ({ src, selectedVideo}, ref) =>
//     {
//   const { captions = [] } = useAppSelector((state) => state?.app);
//   const [videoWidth, setVideoWidth] = useState(0);
//   const [videoHeight, setVideoHeight] = useState(0);
//   const videoRef: React.MutableRefObject<HTMLVideoElement|null> = useRef(null);
//   const canvasRef: React.MutableRefObject<HTMLCanvasElement| null> = useRef(null);
//   const [hideCanvas, setHideCanvas] = useState(false);
//
//
//
//       useImperativeHandle(ref, () => ({
//         doTranscode() {
//           async function* myGenerator() {
//             yield 'Starting transcoding';
//             // getting video metadata
//             const response = await fetch(videoRef.current.src);
//             const mp4Info = await getMp4Info(response)
//
//             let fps = 30;
//             mp4Info.tracks.forEach(track => {
//               console.log(`Track ID: ${track.id}, Type: ${track.type}, FPS: ${Math.round(track.nb_samples / (track.duration / track.timescale))}`);
//               if (track.type === 'video') {
//                 fps = Math.round(track.nb_samples / (track.duration / track.timescale));
//               }
//             });
//
//             setIsTranscoding(true);
//             console.info('Loading ffmpeg-core.js');
//             if (!ffmpeg.isLoaded())
//               await ffmpeg.load();
//             yield 'Generating Subtitle frames';
//             const downloadGenerator = startAnimation(async function* () {
//               console.info('Start transcoding');
//               ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
//
//               yield 'Generating 720p video';
//               await ffmpeg.run(
//                 '-i', 'test.mp4',
//                 '-vf', "scale=720:-1,pad=ceil(iw/2)*2:ceil(ih/2)*2",
//                 '-c:v', 'libx264',
//                 '-c:a', 'copy',
//                 'scaled_test.mp4'
//               );
//
//               yield 'Combining subtitle frames to video';
//               await ffmpeg.run(
//                 '-i', 'scaled_test.mp4',
//                 '-framerate', '' + fps, '-i', '%07d.png',
//                 '-c:v', 'libx264',
//                 '-c:a', 'copy',
//                 '-crf', '11',
//                 '-filter_complex', '[0:v]scale=720:-1[video];[1:v]scale=720:-1[overlay];[video][overlay]overlay',
//                 '-threads', '8',
//                 'output.mp4'
//               );
//
//               console.info('Complete transcoding');
//               yield 'Done.';
//               const data = ffmpeg.FS('readFile', 'output.mp4');
//               const link = document.createElement('a');
//               link.href = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })); // URL of the file to download
//               link.download = 'transcribed.mp4'; // The name for the downloaded file
//               document.body.appendChild(link);
//               link.click();
//               document.body.removeChild(link);
//
//             }, false, fps);
//
//             for await (const status of downloadGenerator) {
//               yield status
//             }
//
//
//             setIsTranscoding(false);
//           }
//           return myGenerator();
//         },
//         getVideoRef() {
//           return videoRef.current;
//         },
//         startAnimation
//       }));
//
//   const intervalIdRef: React.MutableRefObject<any> = useRef(null);
//   const subtitles = captions as any[];
//   const stopLoop = () => {
//     clearInterval(intervalIdRef.current);
//   };
//   // When component unmounts, clean up the interval:
//   useEffect(() => stopLoop, []);
//
//   useEffect(() => {
//     stopLoop()
//     setHideCanvas(selectedVideo === 'original')
//
//     console.log('selectedVideo',selectedVideo)
//     if (!(window.document.getElementById('alvin') as HTMLVideoElement).src) {
//       return
//     }
//
//     if (videoRef.current) {
//       console.log('videoRef dimensions', videoRef.current.videoHeight, videoRef.current.videoWidth)
//       videoRef.current.currentTime = 0;
//       videoRef.current.pause();
//
//       let interval = setInterval(() => {
//         if (videoRef.current && videoRef.current.videoHeight === 0) {
//           // do nothing
//         } else {
//           if (videoRef.current) {
//             console.log('videoRef dimensions', videoRef.current.videoHeight, videoRef.current.videoWidth)
//             if (videoRef.current.videoHeight > videoRef.current.videoWidth) {
//               setVideoWidth(window.innerHeight * 0.75 / videoRef.current.videoHeight * videoRef.current.videoWidth);
//               setVideoHeight(window.innerHeight * 0.75 );
//             } else {
//               setVideoWidth(window.innerWidth * 0.5 );
//               setVideoHeight(window.innerWidth * 0.5 * videoRef.current.videoHeight / videoRef.current.videoWidth);
//             }
//             clearInterval(interval)
//           }
//         }
//
//       }, 1000)
//     } else {
//       return
//     }
//
//   }, [selectedVideo]);
//
//
//
//   const startAnimation = async (callback: { (): Promise<void>; (): Promise<void>; (): void; }, isPreview = false) => {
//
//     let frameCount = 0;
//
//
//     let currentTime = 0;
//     let fadeInDuration = 1;  // 1 second
//     let fadeOutDuration = 1; // 1 second
//
//     const canvas = canvasRef.current;
//     if (!canvas) {
//       return;
//     }
//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//       return;
//     }
//
//     const drawSubtitle = (subtitle: any, opacity: number) => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//       let fontSize = 48;
//       const bounceMultiplier = 4
//       const bounceDuration = 0.2;
//       if (opacity >= 0 && opacity < bounceDuration) {
//         fontSize = fontSize + (Math.abs((bounceDuration/2) - Math.abs(opacity - (bounceDuration/2))) * fontSize) * bounceMultiplier;
//       }
//
//       ctx.font = `bold ${fontSize}px Arial`; // Bold font
//       ctx.textAlign = 'center'; // Center the text horizontally
//       ctx.textBaseline = 'middle'; // Center the text vertically
//       ctx.fillStyle = 'white'; // Text color
//
//       // Shadow for outline effect
//       ctx.lineWidth = 6;
//       ctx.strokeStyle = 'black'; // Outline color
//       ctx.strokeText(subtitle.text, canvas.width / 2, canvas.height / 2); // Draw outline
//
//       // Draw the text
//       ctx.fillText(subtitle.text, canvas.width / 2, canvas.height / 2); // Draw text
//     }
//
//     const captureFrame = async (frameCount: number, isPreview: boolean) => {
//       canvas.toBlob(async (blob) => {
//         if (blob) {
//           let pngFile = frameCount.toString().padStart(7, '0');
//           const url = await blobToDataURL(blob) as string;
//           ffmpeg.FS('writeFile', `${pngFile}.png`, await fetchFile(url));
//         }
//       }, 'image/png');
//     };
//
//
//     const animate = async (): Promise<any> => {
//       currentTime += timeIncrement; // Increment time by 50ms
//
//       if (!subtitles || subtitles.length === 0) {
//         stopLoop()
//         return;
//       }
//
//       const subtitle = subtitles.find(s => currentTime >= s.start && currentTime <= s.end);
//
//       if (subtitle) {
//         let opacity = 1;
//         if (currentTime < subtitle.start + fadeInDuration) {
//           opacity = (currentTime - subtitle.start) / fadeInDuration; // Fade in
//         } else if (currentTime > subtitle.end - fadeOutDuration) {
//           opacity = (subtitle.end - currentTime) / fadeOutDuration; // Fade out
//         }
//
//         drawSubtitle(subtitle, opacity);
//       } else {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//       }
//
//       if (!isPreview) {
//         await captureFrame(frameCount, isPreview);
//       }
//
//       frameCount++;
//       if (frameCount < 500) {
//         if(isPreview) {
//           console.log('currentTime', currentTime, selectedVideo )
//         } else {
//           requestAnimationFrame(animate);
//         }
//       } else {
//         callback()
//         stopLoop()
//       }
//     };
//
//     if (selectedVideo === 'captioned' && isPreview) {
//       stopLoop()
//       intervalIdRef.current = setInterval(animate,timeIncrement * 1000)
//     }
//
//
//     // Start animation
//     const frame = await animate();
//
//     // Cleanup on component unmount
//     return () => cancelAnimationFrame(frame);
//   };
//   const blobToDataURL = (blob: Blob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };
//
//   const ffmpeg = createFFmpeg({
//     corePath: '/ffmpeg-core.js',
//     log: true,
//   });
//   const doPreview = async () => {
//
//     console.log('videoRef', videoRef.current)
//
//
//     const video = videoRef.current;
//     console.info('Previewing output video');
//     if (!ffmpeg.isLoaded()) {
//       await ffmpeg.load();
//     }
//     if (!video) {
//       return;
//     }
//     video.currentTime = 0;
//     video.play()
//     startAnimation(async () => {
//       video.pause();
//       video.currentTime = 0;
//       console.info('Preview complete');
//     }, true);
//   }
//
//
//
//   return (
//       <div className="w-full relative h-max text-center">
//         <div style={{position: "relative", height: videoHeight, width: videoWidth, display: "inline-block"}}>
//           <canvas ref={canvasRef} width={videoWidth} height={videoHeight}
//               // border: '1px solid #000'
//               onClick={() => {
//                 const video = videoRef.current;
//                 if (!video) {
//                     return
//                 }
//                 if (!video.paused) {
//                   video.pause()
//                   stopLoop()
//                 } else {
//                   video.currentTime = 0
//                   doPreview()
//                 }
//               }}
//                   style={{position: "absolute", left: 0, zIndex: 1, display: hideCanvas ? 'none': 'unset'}}>
//           </canvas>
//           <video
//               id='alvin'
//               crossOrigin={"anonymous"}
//               src={src} ref={videoRef} controls style={{"position": "absolute", "left": 0}}>
//           </video>
//         </div>
//       </div>
//   );
// });
//
// export default TranscribedVideoContainer;
