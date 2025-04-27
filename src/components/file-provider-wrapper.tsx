'use client';

import {FileProvider} from "@/components/landing-page/file-context";

export default function FileProviderWrapper({ children }) {
  return <FileProvider>{children}</FileProvider>;
}
