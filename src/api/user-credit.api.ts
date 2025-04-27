import axios from "@/api/axiosCsBackend";
import {
  getAccessToken,
  REACT_APP_BACKEND_URL,
} from "@/utils/utils";


export const getUserTokenCredit = async (): Promise<any> => {
  return await axios
    .get(`${REACT_APP_BACKEND_URL}/user/credits`, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request');
    });
};

export const checkUserCreditTokens = async (formData?): Promise<any> => {
  return await axios
    .post(`${REACT_APP_BACKEND_URL}/update/user/credit`, formData, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request');
    });
};