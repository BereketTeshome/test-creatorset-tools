import axios from 'axios'
import {
    getAccessToken,
    logout,
    REACT_APP_BACKEND_URL,
    setTokenInCookies,
    setTokenInLocalstorage,
    setUserInLocalstorage
} from "@/utils/utils";
import Cookies from 'js-cookie'

const axiosCsBackend = axios.create()



axiosCsBackend.interceptors.request.use(
    config => {
        const token = getAccessToken()
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        config.headers['Accept'] = 'application/json'
        config.headers['Content-Type'] = 'application/json'

        return config
    }, error => {
        Promise.reject(error)
    }
)

axiosCsBackend.interceptors.response.use(response => {
    return response
}, async error => {
    const res = error.response
    const data = res.data.error
    const originalRequest = error.config
    const renewTokensURL = REACT_APP_BACKEND_URL + "/auth/renewTokens"
    if (error.response.status === 401 &&
        (originalRequest.url === renewTokensURL || "InvalidToken" == data.type || originalRequest._retry)
        || error.response.status === 403) {
        // remove user state
        logout();

        return Promise.reject(error)
    }

    if (401 === res.status || "TokenExpiredError" == data?.type) {
        originalRequest._retry = true
        return axiosCsBackend.post(renewTokensURL, {
            data: {
                id_token: localStorage["idToken"],
                refresh_token: localStorage["refreshToken"]
            }
        }).then(res => {
            setTokenInLocalstorage(res.data.data.tokens)
            setTokenInCookies(res.data.data.tokens)
            setUserInLocalstorage(res.data.data.user);
            return axiosCsBackend(originalRequest)
        }).catch(err => {
            console.error("What the hell is going on", err)
            logout();
            return Promise.resolve();
        })

    }


    return Promise.reject(error)

})

export default axiosCsBackend
