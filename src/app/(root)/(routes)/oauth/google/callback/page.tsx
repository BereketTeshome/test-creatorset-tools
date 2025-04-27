"use client";
import {Suspense, useEffect} from "react";

import { useSearchParams } from 'next/navigation'
import {REACT_APP_BACKEND_URL, setTokenInCookies, setTokenInLocalstorage} from "@/utils/utils";
import axiosCsBackend from "@/api/axiosCsBackend";
import { AxiosResponse } from "axios";


async function loginGoogle(code) {
    const url = REACT_APP_BACKEND_URL + "/auth/google"
    let response: AxiosResponse<any, any>
    try {
        response = await axiosCsBackend.post(url, {
            data: { code, redirect_uri: 'https://tools-dev.creatorset.com/oauth/google/callback' }
        })

    } catch (error) {
        return null
    }
    return response
}


function GoogleOauthCallback(props) {
    const searchParams = useSearchParams()
    const authorizationCode = searchParams.get('code')


    useEffect(() => {
        const doGoogleCallback = async () => {

            if (authorizationCode) {
                const response = await loginGoogle(authorizationCode);
                console.log("Google login response", response)
                if (response && response.data && response.data.data && response.data.data.tokens) {
                    setTokenInLocalstorage(response.data.data.tokens)
                    setTokenInCookies(response.data.data.tokens)

                    const user = response.data.data.user
                    localStorage.setItem('user', JSON.stringify({ id: user.sub, email: user.email, name: user.name, providerName: user.providerName }));
                    localStorage.setItem('isSingleSignOn', 'true');

                    window.location.href = `/my-projects`;
                }
            } else {
                console.error("No authorization code found")
                window.location.href = '/';
            }

        }
        doGoogleCallback()
    }, []);
    return <div></div>
}

export default function CallbackPage() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <GoogleOauthCallback />
        </Suspense>
    )
}
