import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import MP4Box from 'mp4box';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMp4Info = async (videoBlob): Promise<{tracks: any}> => {
  const mp4boxfile = MP4Box.createFile();
  return new Promise((resolve, reject) => {
    mp4boxfile.onReady = function (info: any) {
      resolve(info);
    };
    mp4boxfile.onError = function (e) {
      reject(e);
    }
    videoBlob.arrayBuffer().then((buffer) => {
      buffer.fileStart = 0;
      mp4boxfile.appendBuffer(buffer);
    });
  });
};
