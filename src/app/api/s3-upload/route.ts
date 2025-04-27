//import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {NextRequest, NextResponse} from "next/server";
import {getAccessToken, REACT_APP_BACKEND_URL} from "@/utils/utils";
import axiosCsBackend from "@/api/axiosCsBackend";
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
//
// async function uploadFiletoS3(file, fileName) {
//   const fileBuffer = file;
//   const uniqueFileName = `${Date.now()}-${fileName?.replace(/\s/g, "-")}`;
//   const params = {
//     Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
//     Key: uniqueFileName,
//     Body: fileBuffer,
//     ContentType: "video",
//   };
//   const command = new PutObjectCommand(params);
//   await s3Client.send(command);
//   return uniqueFileName;
// }
const BYTES_TO_MEGABYTES = 1024 ** (2 ** -1);


const saveFirstDraft =
    (videoCredentials: { externalId: any; presignedURL: any; fileSizeInMb: any; fileName: any; }) => () => {
      const { externalId, fileName, fileSizeInMb, presignedURL } = videoCredentials;

      const subtitles = [
        {
          text: '',
          start: 0,
          end: 0,
        },
      ];

      const dataToSend = {
        data: {
          externalId,
          presignedURL,
          videoURL: '',
          bucketPath: 'creatorset-videos',
          projectTitle: fileName,
          fileSize: fileSizeInMb,
          subtitles,
          srt: '',
          videoStatus: 'In Progress',
          status: 'A',
        },
      };
      return axiosCsBackend.post(`${REACT_APP_BACKEND_URL}/subtitle/save-subtitle`, dataToSend, {
        headers: {
          Authorization: 'BEARER ' + getAccessToken(),
        },
      });
    };


// async function fetchSubtitlesForVideo(videoId: any) {
//   return axiosCsBackend.get(`${REACT_APP_BACKEND_URL}/subtitle/process-subtitle/${videoId}`, {
//     headers: {
//       Authorization: 'BEARER ' + getAccessToken(),
//     },
//   });
// }

// async function uploadFiletoS3ViaBackend(videoFile: any) {
//   const res = await axiosCsBackend.get(`${REACT_APP_BACKEND_URL}/subtitle/getUploadLink`, {
//     headers: {
//       Authorization: 'BEARER ' + getAccessToken(),
//     },
//   });
//
//   const s3Url = res.data.uploadDetails.url;
//
//   console.log('s3Url',s3Url)
//
//   // upload file to s3Url
//   await fetch(s3Url, {
//     method: 'PUT',
//     body: videoFile,
//     headers: {
//       'Content-Type': videoFile.type // Ensure the content type matches the file
//     }
//   });
//
//
//
//   const videoCredentials = {
//     externalId: res.data.uploadDetails.external_id,
//       presignedURL: s3Url,
//       fileSizeInMb: `${videoFile.size * BYTES_TO_MEGABYTES}`,
//       fileName: `${videoFile.name}`,
//   };
//
//   console.log('videoCredentials',videoCredentials)
//
//   const saveVideoRes = await saveFirstDraft(videoCredentials)();
//   const savedVideo = saveVideoRes.data.data;
//   const subtitleRes = await fetchSubtitlesForVideo(savedVideo.id);
//   return ({
//     fileName: videoFile.name,
//     externalId: videoCredentials.externalId,
//     success: true
//   })
// }

// export async function POST(req) {
//   try {
//     const video = await req.formData();
//     const file = video.get("file");
//     if (!file) {
//       return NextResponse.json({ error: "Files is required" }, { status: 400 });
//     }
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const fileName = await uploadFiletoS3(buffer, file.name);
//
//     return NextResponse.json({ fileName, success: true });
//   } catch (error) {
//     console.log('error', error);
//     return NextResponse.json({ error: error ?? "Error uploading file." });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const video = await req.formData();
//     const file = video.get("file");
//     if (!file) {
//       return NextResponse.json({ error: "Files is required" }, { status: 400 });
//     }
//     // const buffer = Buffer.from(await file.rrayBuffer());
//     const result = await uploadFiletoS3ViaBackend(file);
//
//     return NextResponse.json(result);
//   } catch (error) {
//     console.log('error', error);
//     return NextResponse.json({ error: error ?? "Error uploading file." });
//   }
// }
