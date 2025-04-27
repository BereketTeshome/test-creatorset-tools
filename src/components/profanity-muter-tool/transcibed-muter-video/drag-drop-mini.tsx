import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useState, useRef, DragEvent} from "react";
import {uploadFilesAndGetTranscriptions} from "@/api/transcriptions.api";
import {setExternalId} from "@/redux/app-slice";
import {useAppDispatch} from "@/redux/store";
import {RefreshCcwIcon} from "lucide-react";

const DragDropMini = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [statusDescription, setStatusDescription] = useState<string>("");
  const allowedTypes: string[] = [".avi", ".mp4", ".mkv"];
  const router = useRouter();
  const dragCounter = useRef<number>(0);
  const dispatch = useAppDispatch();

  const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    setError("");

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) =>
      allowedTypes.some((type) => file.name.toLowerCase().endsWith(type))
    );

    if (validFiles.length === 0) {
      setError("Please drop only .avi, .mp4, or .mkv files.");
      return;
    }

    if (validFiles.length !== files.length) {
      setError(
        "Some files were ignored. Only .avi, .mp4, and .mkv files are accepted."
      );
    }

    console.log("Valid dropped files:", validFiles);
    if (validFiles[0]) {
      const fileData = new FormData();
      fileData.append("file", validFiles[0]);
      setLoading(true);
      try {

        for await (const status of uploadFilesAndGetTranscriptions(validFiles[0], "profanity_muter")) {
          console.log("status", status);
          console.log("status type", typeof status);
          if (typeof status === 'string') {
            setStatusDescription(status);
          } else if (status instanceof XMLHttpRequest && status.upload) {
            console.log('xhr', status);
            status.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                // Yield the percentage of completion
                setStatusDescription(`Uploading file... ${percentComplete.toFixed(0)}% complete`);
              }
            };
          } else if (status && status['success'] && status['externalId'] != null) {
            dispatch(setExternalId(status['externalId']));
            router.push(`/captioned/${status['externalId']}`);
          }
        }
      } catch (error) {
        console.log("error", error);
        setError("An error occurred while uploading the file.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="box-dashed flex-col flex items-center justify-center h-[164px] relative"
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {loading ? (
        <div className="absolute inset-0 bg-gray-200/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-blue-500 font-semibold">{statusDescription}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2.5">
            <Image
              src="/refresh.svg"
              alt=""
              width={336}
              height={336}
              className="h-[14px] mb-0.5 w-[14px]"
            />
            <p className="text-gray text-xl">Change Video</p>
          </div>
          <p className="text-gray2">Drag and Drop media here</p>
          {error && <p className="text-red/80 text-sm mt-1">{error}</p>}
          {isDragging && (
            <div
              className="absolute bg-red/80 rounded-lg inset-0 bg-red-500/80 flex items-center justify-center pointer-events-none">
              <p className="text-white text-xl font-semibold">
                Drop video files here...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DragDropMini;
