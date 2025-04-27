import localFont from "@next/font/local";

export const neue = localFont({
  src: [
    {
      path: "../../public/fonts/NeuePlak-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-neue",
});
const neueSemiBold = localFont({
  src: [
    {
      path: "../../public/fonts/NeuePlak-SemiBold.ttf",
      weight: "400",
    },
  ],
  variable: "--font-neue-semi-bold",
});
export {neueSemiBold};
