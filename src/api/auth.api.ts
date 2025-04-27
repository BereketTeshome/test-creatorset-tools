import axiosCsBackend from "@/api/axiosCsBackend";
import {getAccessToken, REACT_APP_BACKEND_URL} from "@/utils/utils";

export async function updatePassword({oldPassword, newPassword}: {oldPassword: string, newPassword: string}) {
  return axiosCsBackend.post(REACT_APP_BACKEND_URL+"/auth/updatePassword", {
    data: {
      oldPassword,
      newPassword,
    }
  }, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
}
