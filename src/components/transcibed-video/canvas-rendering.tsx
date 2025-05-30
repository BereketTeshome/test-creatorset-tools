import React, {useRef, useState} from 'react';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
import './App.css';

function CanvasRendering() {
    const timeIncrement = 0.025
    const [videoSrc, setVideoSrc] = useState('waves.mp4');
    const [message, setMessage] = useState('Click Start to transcode');

    // canvas
    const canvasRef: React.MutableRefObject<HTMLCanvasElement|null> = useRef(null);
    const videoRef: React.MutableRefObject<HTMLVideoElement|null> = useRef(null);

    const startAnimation = async (callback = () => {}, isPreview = false) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return
        }

        let frameCount = 0;


        const subtitles = [
            { text: "Hello", start: 0, end: 1 },
            { text: "Guys,", start: 1, end: 2 },
            { text: "This", start: 2, end: 3 },
            { text: "is", start: 3, end: 4 },
            { text: "a", start: 4, end: 5 },
            { text: "test", start: 5, end: 6 },
            { text: "for", start: 6, end: 7 },
            { text: "captions", start: 7, end: 8 },
            { text: "😊", start: 8, end: 9 },
        ];

        let currentTime = 0;
        let fadeInDuration = 1;  // 1 second
        let fadeOutDuration = 1; // 1 second

        const drawSubtitle = (subtitle: any, opacity: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            // ctx.font = '12px Arial';
            // ctx.textAlign = 'center';
            // ctx.textBaseline = 'bottom';
            // ctx.fillText(subtitle.text, canvas.width / 2, canvas.height - 5);

            let fontSize = 48;
            const bounceMultiplier = 4
            const bounceDuration = 0.2;
            if (opacity >= 0 && opacity < bounceDuration) {
                fontSize = fontSize + (Math.abs((bounceDuration/2) - Math.abs(opacity - (bounceDuration/2))) * fontSize) * bounceMultiplier;
            }

            ctx.font = `bold ${fontSize}px Arial`; // Bold font
            ctx.textAlign = 'center'; // Center the text horizontally
            ctx.textBaseline = 'middle'; // Center the text vertically
            ctx.fillStyle = 'white'; // Text color

            // Shadow for outline effect
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'black'; // Outline color
            ctx.strokeText(subtitle.text, canvas.width / 2, canvas.height / 2); // Draw outline

            // Draw the text
            ctx.fillText(subtitle.text, canvas.width / 2, canvas.height / 2); // Draw text
        }

        const animate = async () : Promise<any>   => {
            currentTime += timeIncrement; // Increment time by 50ms

            const subtitle = subtitles.find(s => currentTime >= s.start && currentTime <= s.end);

            if (subtitle) {
                let opacity = 1;
                if (currentTime < subtitle.start + fadeInDuration) {
                    opacity = (currentTime - subtitle.start) / fadeInDuration; // Fade in
                } else if (currentTime > subtitle.end - fadeOutDuration) {
                    opacity = (subtitle.end - currentTime) / fadeOutDuration; // Fade out
                }

                drawSubtitle(subtitle, opacity);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            if (!isPreview) {
                await captureFrame(frameCount, isPreview);
            }

            frameCount++;
            if (frameCount < videoRef.current.duration / timeIncrement) {
                if(isPreview) {
                    setTimeout(animate,timeIncrement * 1000)
                } else {
                    requestAnimationFrame(animate);
                }
            } else {
                callback()
            }
        };

        const captureFrame = async (frameCount: number, isPreview: boolean) => {
            canvas.toBlob(async (blob) => {
                if (blob) {
                    let pngFile = frameCount.toString().padStart(7, '0');
                    const url = await blobToDataURL(blob) as string;
                    ffmpeg.FS('writeFile', `${pngFile}.png`, await fetchFile(url));
                }
            }, 'image/png');
        };

        // Start animation
        const frame = await animate();

        // Cleanup on component unmount
        return () => cancelAnimationFrame(frame);
    };
    const blobToDataURL = (blob: Blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const ffmpeg = createFFmpeg({
        corePath: '/ffmpeg-core.js',
        log: true,
    });
    const doPreview = async () => {

        const video = videoRef.current;
        setMessage('Previewing output video');
        await ffmpeg.load();
        if (video) {
            video.currentTime = 0;
            video.play()
            startAnimation(async () => {
                video.pause();
                video.currentTime = 0;
                setMessage('Preview complete');
            }, true);
        }
    }
    const doTranscode = async () => {
        setMessage('Loading ffmpeg-core.js');
        await ffmpeg.load();
        startAnimation(async () => {

            setMessage('Start transcoding');
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile('/waves.mp4'));
            await ffmpeg.run(
                '-i', 'test.mp4',
                '-framerate', ''+1/timeIncrement, '-i', '%07d.png',
                '-c:v', 'libx264',
                '-c:a', 'copy',
                // '-b:v', '2M',
                // '-crf', '11',
                '-crf', '40',
                '-filter_complex', 'overlay',
                '-threads', '8',
                'output.mp4');
            setMessage('Complete transcoding');
            const data = ffmpeg.FS('readFile', 'output.mp4');
            setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
        });
    };
    return (
        <div className="App">
            <p/>
            <div style={{position: "relative", height: "500px"}}>
                <canvas ref={canvasRef} width="898" height="253"
                    // border: '1px solid #000'
                        style={{position: "absolute", left: 0, zIndex: 1000}}></canvas>
                <video src={videoSrc} ref={videoRef} controls style={{"position": "absolute", "left": 0}}></video>
            </div>
            <br/>

            <button onClick={doPreview}>Preview</button>
            <button onClick={doTranscode}>Start</button>
            <p>{message}</p>
        </div>
    );
}

export default CanvasRendering;
