import React from 'react';
import { GoogleLogin } from '@react-oauth/google';


export const GoogleLoginForm = ({ onSuccess }) => {

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
            </div>



        </>
    )
}
