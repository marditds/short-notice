import React from 'react';
import { googleOAuthLogin } from '../../../lib/context/dbhandler';
import { Button, Image } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import './GoogelLoginForm.css';
import google_btn from '../../../assets/web_neutral_sq_SI@1x.png';

export const GoogleLoginForm = ({ subtitle }) => {

    const { setIsLogInBtnClicked } = useUserContext();

    const handleOnGoogleLoginClick = () => {
        console.log('handleOnGoogleLoginClick is clicked.');

        setIsLogInBtnClicked(true);
        googleOAuthLogin();
    }

    return (
        <div className="login__btn">
            <Button onClick={handleOnGoogleLoginClick} className='p-0 border-0 d-block mx-auto signin__btn' aria-label='Sign in with Google'>
                <Image
                    src={google_btn}
                    alt='Sign in with Google'
                />
            </Button>

            <sub>{subtitle}</sub>
        </div>
    )
}
