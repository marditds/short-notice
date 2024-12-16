import React from 'react';
import { GoogleLogin } from '@react-oauth/google';


export const GoogleLoginForm = ({ onSuccess, subtitle }) => {

    // const handleSuccess = (credentialResponse) => {
    //     if (typeof onSuccess === 'function') {
    //         onSuccess(credentialResponse);
    //     } else {
    //         console.error('onSuccess is not a function');
    //     }
    // };

    return (
        <>
            <div className="login__btn">
                <GoogleLogin
                    onSuccess={onSuccess}

                    onError={() => {
                        console.log('Login Failed');
                    }}

                    shape='pill'
                    auto_select={false}
                />
                <sub>{subtitle}</sub>
            </div>
        </>
    )
}
