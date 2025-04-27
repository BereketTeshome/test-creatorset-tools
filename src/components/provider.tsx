"use client";
import store from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import FileProviderWrapper from "@/components/file-provider-wrapper";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>
    <FileProviderWrapper>
    {children}
    </FileProviderWrapper>
  </Provider>;
};

export default RootProvider;
