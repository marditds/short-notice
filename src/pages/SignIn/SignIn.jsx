import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserSession, getAccount } from '../../lib/context/dbhandler';
import { useUserContext } from '../../lib/context/UserContext';
import sn_logo from '../../assets/sn_long.png';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';

const SignIn = () => {

    const {
        setUserId,
        setUserEmail,
        setGivenName,
        setUser,
        setIsLoggedIn
    } = useUserContext();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingInLoading, setIsLoggingInLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [newYearWish, setNewYearWish] = useState('');

    const onUserLogin = async (event) => {

        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);

        if (newYearWish) {
            setErrorMsg('Try again.');
            return;
        }

        if (!email || !password) {
            return;
        }

        let loginSuccess = false;

        try {
            setIsLoggingInLoading(true);

            const userSession = await createUserSession(email, password);

            if (typeof userSession === 'string') {
                setErrorMsg(userSession);
                return;
            } else {
                console.log('THIS IS USER Sesssion:', userSession);

                const user = await getAccount();

                console.log('THIS IS USER in SIGNIN:', user);

                setUserEmail(user.email);
                setUserId(user.$id);
                setGivenName(user.name);
                setUser(user);
                setIsLoggedIn(true);

                loginSuccess = true;
            }

            console.log('Logged in clicked.');
        } catch (error) {
            console.log('Error logging in user:', error);
            setErrorMsg('Something went wrong. Please try again.');
        } finally {
            setIsLoggingInLoading(false);
            if (loginSuccess) {
                navigate('/user/feed');
            }
        }
    }

    const formFields = [
        {
            label: 'Email:',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            controlId: 'signInFormEmail',
        },
        {
            label: 'Password:',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            controlId: 'signInFormPassword',
        }
    ]

    return (
        <SignFormLayout
            type="signin"
            titleText="Sign in to"
            logo={sn_logo}
            onSubmit={onUserLogin}
            formFields={formFields}
            submitButtonText="Sign in"
            isLoading={isLoggingInLoading}
            errorMsg={errorMsg}
            wishValue={newYearWish}
            onWishChange={(e) => setNewYearWish(e.target.value)}
            isSubmitDisabled={email === '' || password.length < 8 || isLoggingInLoading}
            alternateRouteText="Don't have an account?"
            alternateRouteLink="/signup"
        />
    )
}

export default SignIn;