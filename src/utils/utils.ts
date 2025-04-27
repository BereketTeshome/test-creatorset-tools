import Cookies from "js-cookie";

export const CDN_URL = "https://d1w2uza1cucogo.cloudfront.net";
let environment = process.env.NODE_ENV;

export const {
  REACT_APP_BACKEND_URL = `${
    "https://api.creatorset.com/api/v1"
    // 'http://localhost:3000/api/v1'
  }`,
  PYTHON_WS_URL = `${
    // 'ws://localhost:7001/ws'
    // 'ws://149.202.84.57:80/ws'
    "wss://ws.creatorset.com:443/ws"
  }`,
  AWS_CLIENT_ID = "1mo0j95f9gtt54b48m57qkbi9",
  AWS_HOSTED_UI = "https://auth.creatorset.com",

  AWS_REDIRECT_URL = "https://tools-dev.creatorset.com/oauth/google/callback",
  PAYPAL_PLAN_ID = `${"P-5GA427870W346990HMMWVUBQ"}`,
  PAYPAL_ClIENT_ID = `${"ATyOM9yg97DRGU-3mOXHU-4Z3AyCtRSirE7SRqt1GNlVERIuBPcqNqq5hHKc1tpbJpMBFe6JH3njrmGm"}`,
} = process.env;

export const URLS = {
  PUBLIC_API: REACT_APP_BACKEND_URL,
};

export const getAccessToken = () => {
  return Cookies.get("idToken");
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("user");
  document.cookie =
    "accessToken=; Domain=.creatorset.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "refreshToken=; Domain=.creatorset.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "idToken=; Domain=.creatorset.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "accessToken=; Domain=tools-dev.creatorset.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "refreshToken=; Domain=tools-dev.creatorset.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "idToken=; Domain=tools-dev.creatorset.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "accessToken=; Domain=localhost; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "refreshToken=; Domain=localhost; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  document.cookie =
    "idToken=; Domain=localhost; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=None";
  localStorage.clear();
  window.location.href = "/";
};

export function setTokenInLocalstorage({
  access_token,
  id_token,
  refresh_token,
}) {
  localStorage.setItem("accessToken", access_token);
  localStorage.setItem("idToken", id_token);
  localStorage.setItem("refreshToken", refresh_token);
}

export function setUserInLocalstorage(user: {
  sub: any;
  email: any;
  name: any;
  providerName: any;
}) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: user.sub,
      email: user.email,
      name: user.name,
      providerName: user.providerName,
    })
  );
}

export function setTokenInCookies({ access_token, id_token, refresh_token }) {
  Cookies.set("accessToken", access_token, {
    expires: 7,
    domain: ".creatorset.com",
    sameSite: "None",
    secure: true,
  });
  Cookies.set("idToken", id_token, {
    expires: 7,
    domain: ".creatorset.com",
    sameSite: "None",
    secure: true,
  });
  Cookies.set("refreshToken", refresh_token, {
    expires: 14,
    domain: ".creatorset.com",
    sameSite: "None",
    secure: true,
  });

  Cookies.set("accessToken", access_token, {
    expires: 7,
    domain: "localhost",
    sameSite: "None",
    secure: true,
  });
  Cookies.set("idToken", id_token, {
    expires: 7,
    domain: "localhost",
    sameSite: "None",
    secure: true,
  });
  Cookies.set("refreshToken", refresh_token, {
    expires: 14,
    domain: "localhost",
    sameSite: "None",
    secure: true,
  });
}

export const getUser = () => {
  return localStorage["user"];
};

export const getUserInfo = () => {
  try {
    const user = getUser();
    return JSON.parse(user);
  } catch (error) {
    return {};
  }
};

export const getSelectedSubscriptionPlanDuration = () => {
  const subscriptionPlanDuration = localStorage["subscriptionPlanDuration"];
  // Check if the value exists (not null or undefined), otherwise return 'monthly'
  return subscriptionPlanDuration ?? "monthly";
};

export const setSelectedSubscriptionPlanDuration = (duration: string) => {
  localStorage.setItem("subscriptionPlanDuration", duration);
};

export const setSelectedSubscriptionPlan = (plan: any) => {
  localStorage.setItem("subscriptionPlan", JSON.stringify(plan));
};

export const getSelectedPlan = () => {
  const subscriptionPlan = localStorage["subscriptionPlan"];
  return subscriptionPlan ? JSON.parse(subscriptionPlan) : null;
};

export const createWebSocketStream = (url) => {
  return new ReadableStream({
    start(controller) {
      const socket = new WebSocket(url);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.progress !== undefined) {
          controller.enqueue(data.progress); // Push data into the stream
        }
        if (data.done == true) {
          console.log("DONE", data);
          controller.enqueue(data.result); // Push data into the stream
          controller.close(); // Close the stream
        }
      };

      socket.onclose = () => controller.close();
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        controller.error(error);
      };
    },
  });
};
