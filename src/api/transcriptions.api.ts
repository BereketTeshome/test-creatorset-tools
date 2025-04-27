//import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {createWebSocketStream, getAccessToken, PYTHON_WS_URL, REACT_APP_BACKEND_URL} from "@/utils/utils";
import axiosCsBackend from "@/api/axiosCsBackend";
import {ProjectType} from "@/components/typings/projects";

const BYTES_TO_MEGABYTES = 1024 ** (2 ** -1);


const saveFirstDraft =
    (videoCredentials: { externalId: any; presignedURL: any; fileSizeInMb: any; fileName: any; }, projectType: ProjectType ) => () => {
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
          projectType: projectType,
          status: 'A',
        },
      };
      return axiosCsBackend.post(`${REACT_APP_BACKEND_URL}/subtitle/save-subtitle`, dataToSend, {
        headers: {
          Authorization: 'BEARER ' + getAccessToken(),
        },
      });
    };


async function fetchSubtitlesForVideo(videoId: any) {
  return axiosCsBackend.get(`${REACT_APP_BACKEND_URL}/subtitle/process-subtitle/${videoId}`, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  });
}

export async function* uploadFilesAndGetTranscriptions(videoFile: any, projectType: ProjectType = "caption_generator") {
  try {
    const res = await axiosCsBackend.get(`${REACT_APP_BACKEND_URL}/subtitle/getUploadLink`, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    });

    const s3Url = res.data.uploadDetails.url;

    yield new Promise((resolve) => resolve('Uploading file...'));

    // upload file to s3Url

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', s3Url, true);
    xhr.setRequestHeader('Content-Type', videoFile.type);
    yield new Promise((resolve) => resolve(xhr));
    await new Promise((resolve, reject) => {

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('suc')
          resolve('success');
        } else {
          console.log('fai')
          reject('fail');
        }
      };

      xhr.onerror = () => Promise.reject(new Error('Upload failed due to a network error'));

      xhr.send(videoFile);

    })
    const externalId = res.data.uploadDetails.external_id
    const videoCredentials = {
      externalId,
      presignedURL: s3Url,
      fileSizeInMb: `${videoFile.size * BYTES_TO_MEGABYTES}`,
      fileName: `${videoFile.name}`,
    };

    // yield new Promise((resolve) => resolve('Upload done, processing subtitles...'));
    yield 'Upload done, processing subtitles...'
    const saveVideoRes = await saveFirstDraft(videoCredentials, projectType)();
    const savedVideo = saveVideoRes.data.data;

    const stream = createWebSocketStream(`${PYTHON_WS_URL}/transcribe/${externalId}/`);
    const reader = stream.getReader();

    await fetchSubtitlesForVideo(savedVideo.id);

    let transcriptionResult = "{}";
    try {
      while (true) {
        const { value, done } = await reader.read();
        console.log('value', value)

        if (done) {
          break;
        }
        transcriptionResult = value
        if (value.length < 300 && !value.includes("avg_logprob")) {
          // Yield WebSocket messages as they arrive
          yield value;
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      yield new Promise((resolve) => resolve(
        {
          fileName: videoFile.name,
          externalId: videoCredentials.externalId,
          success: false,
        }
      ));
    }

    await uploadTranscription(externalId, JSON.parse(transcriptionResult));
    const result = await retrieveTranscription(externalId);
    console.log('transcription result',result)


    yield new Promise((resolve) => resolve(
        {
          fileName: videoFile.name,
          externalId: videoCredentials.externalId,
          success: true,
        }
    ));
  } catch (error) {
    console.log('error', error);
    return {
      error: error ?? "Error uploading file.",
      success: false,
      fileName: null,
      externalId: null,
    };
  }
}

export async function uploadTranscription(externalId: string, transcriptionResult: any) {
  return axiosCsBackend.put(REACT_APP_BACKEND_URL+"/subtitle/video/" + externalId, {
    subtitles: transcriptionResult,
  }, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
}

export async function updateProfanityWhitelist(externalId: string, whitelist: any) {
  return axiosCsBackend.put(REACT_APP_BACKEND_URL+"/subtitle/update-profanity-whitelist/" + externalId, {
    profanityWhitelist: whitelist,
  }, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
}

export async function retrieveTranscription(externalId: string) {
  return axiosCsBackend.get(REACT_APP_BACKEND_URL+"/subtitle/video/" + externalId, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
}

export async function generateProfanityMuted(externalId: string, beepMethod: string, wordRetention: number) {
  return axiosCsBackend.get(REACT_APP_BACKEND_URL+`/subtitle/final-render/${externalId}/${beepMethod}?retention=${wordRetention}`, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
}
