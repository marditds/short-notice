import React from 'react';
import { googleOAuthLogin } from '../../../lib/context/dbhandler';
import { Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';

export const GoogleLoginForm = ({ subtitle }) => {

    const { setIsLogInBtnClicked } = useUserContext();

    const handleOnGoogleLoginClick = () => {
        console.log('handleOnGoogleLoginClick is clicked.');

        setIsLogInBtnClicked(true);
        googleOAuthLogin();
    }

    return (
        <>
            <div className="login__btn">
                <Button onClick={handleOnGoogleLoginClick}>
                    Login with Google
                </Button>

                <sub>{subtitle}</sub>
            </div>
        </>
    )
}
