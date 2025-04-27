import { createSlice } from "@reduxjs/toolkit";
import {Caption} from "@/components/typings/caption";

const initialState = { originalVideo: "", captionedVideo: "asd", captions: null, externalId: null, profanityWhitelist: [] };

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOriginalVideo: (state, action) => {
      state.originalVideo = action.payload;
    },
    setCaptionedVideo: (state, action) => {
      state.captionedVideo = action.payload;
    },
    setCaptions: (state, action: {payload: Caption[]}) => {
     console.log('setCaptions', action.payload)
      state.captions = action.payload;
    },
    setExternalId: (state, action) => {
      console.log('setExternalId', action.payload)
      window.localStorage.setItem('externalId', action.payload)
      state.externalId = action.payload;
    },
    setProfanityWhitelist: (state, action) => {
      console.log('setProfanityWhitelist', action.payload)
      state.profanityWhitelist = action.payload;
    },
  },
});

export const { setOriginalVideo, setCaptionedVideo, setCaptions , setExternalId, setProfanityWhitelist} =
  appSlice.actions;

export default appSlice.reducer;
