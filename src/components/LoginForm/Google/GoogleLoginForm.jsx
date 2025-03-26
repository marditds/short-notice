import React from 'react';
import { googleOAuthLogin } from '../../../lib/context/dbhandler';
import { Button } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';


export const GoogleLoginForm = ({ onSuccess, subtitle }) => {


    return (
        <>
            <div className="login__btn">
                <Button onClick={googleOAuthLogin}>Login with Google</Button>
                {/* <GoogleLogin
                    onSuccess={onSuccess}

                    onError={() => {
                        console.log('Login Failed');
                    }}

                    shape='pill'
                    auto_select={false}
                /> */}
                <sub>{subtitle}</sub>
            </div>
        </>
    )
}
