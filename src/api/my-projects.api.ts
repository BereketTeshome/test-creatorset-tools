import axiosCsBackend from "@/api/axiosCsBackend";
import {getAccessToken, REACT_APP_BACKEND_URL} from "@/utils/utils";

export async function retrieveMyProjects() {
  return axiosCsBackend.get(REACT_APP_BACKEND_URL+"/tools/my-projects", {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
}

export async function deleteMyProject(externalId: string) {
  return axiosCsBackend.delete(REACT_APP_BACKEND_URL+`/tools/delete-project/${externalId}`, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
}
