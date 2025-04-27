import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export const getDataFromToken = (cookieStore: ReadonlyRequestCookies | any) => {
  try {
    const token = cookieStore.get("idToken");
    const decodedToken = jwt.decode(
      token?.value ?? "",
    );

    console.log("decodedToken", decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("getDataFromToken", error);
    return null;
  }
};
