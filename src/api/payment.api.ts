import axios from "@/api/axiosCsBackend";
import {
  getAccessToken,
  getUserInfo,
  logout, PAYPAL_PLAN_ID,
  REACT_APP_BACKEND_URL,
  setTokenInCookies,
  setTokenInLocalstorage
} from "@/utils/utils";

export const processPayment = async (formData) => {
  return await axios
    .post(`${REACT_APP_BACKEND_URL}/user/${getUserInfo().id}/subscribe`, formData, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    })
    .then((res) => {
      return res.status;
    })
    .catch((_err) => {
      console.log('Error in request');
    });
};

export const getPlanId = () => {
  return PAYPAL_PLAN_ID
};

export const getStripeConfig = async (): Promise<any> => {
  return await axios
    .get(`${REACT_APP_BACKEND_URL}/stripe/config`, {
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

export const createStripeSubscription = async (formData?) => {
  return await axios
    .post(`${REACT_APP_BACKEND_URL}/stripe/create-subscription`, formData, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request ', _err);
      return {data: null}
    });
};

export const createStripeSubscriptionCheckout = async (formData?): Promise<any> => {
  return await axios
    .post(`${REACT_APP_BACKEND_URL}/stripe/create-checkout-session`, formData, {
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
export const getSubscriptionPaymentHistory = async () => {
  return await axios
    .get(`${REACT_APP_BACKEND_URL}/subscription/history`, {
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

export const cancelSubscription =  async (activePlan) => {
 return await axios
    .post(`${REACT_APP_BACKEND_URL}/user/${getUserInfo().id}/unsubscribe/${activePlan.planId}`, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request');
      throw 'ERROR'
    });
};


export const getSubscriptionPlans = async () => {
  return await axios
    .get(`${REACT_APP_BACKEND_URL}/subscription/plans`, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request');
      throw 'ERROR'
    });
};

export async function getMySubscription(userId: any): Promise<any | void> {
  const url =`${REACT_APP_BACKEND_URL}/user/${userId}/subscription`

  return await axios.get(url, {
    headers: {
      Authorization: 'BEARER ' + getAccessToken(),
    },
  })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request');
      throw 'ERROR'
    });
}

export const getStripeConfigById = async (priceId: string): Promise<any> => {
  return await axios
    .get(`${REACT_APP_BACKEND_URL}/stripe/detail/${priceId}/config`, {
      headers: {
        Authorization: 'BEARER ' + getAccessToken(),
      },
    })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request ::: ', _err);
    });
};

export const getPublicSubscriptionPlans = async () => {
  return await axios
    .get(`${REACT_APP_BACKEND_URL}/public/subscription/plans`, {
      headers: { },
    })
    .then((res) => {
      return res;
    })
    .catch((_err) => {
      console.log('Error in request');
      throw 'ERROR'
    });
};

export const verifyStripePayment =  async (formData) => {
  return await axios
     .post(`${REACT_APP_BACKEND_URL}/stripe/verify-payment`,formData, {
       headers: {
         Authorization: 'BEARER ' + getAccessToken(),
       },
     })
     .then((res) => {
       return res;
     })
     .catch((_err) => {
       console.log('Error in request');
       throw 'ERROR'
     });
 };

 export const createStripeSingleTransactionCheckout = async (formData?): Promise<any> => {
  return await axios
    .post(`${REACT_APP_BACKEND_URL}/stripe/create-single-checkout-session`, formData, {
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
