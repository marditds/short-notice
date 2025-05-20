import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserSession } from '../../lib/context/dbhandler';
import { useUserContext } from '../../lib/context/UserContext';
import sn_logo from '../../assets/sn_long.png';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';
import { getUserByIdQuery } from '../../lib/context/dbhandler';
import { LoadingComponent } from '../../components/Loading/LoadingComponent';

const SignIn = () => {

    const {
        isLoggedIn,
        setUserId,
        setUserEmail,
        setIsLoggedIn,
    } = useUserContext();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingInLoading, setIsLoggingInLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [newYearWish, setNewYearWish] = useState('');

    // Navigate to feed if logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/user/feed')
        }
    }, [isLoggedIn])

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
        let userExistsInCollection = false;

        try {
            setIsLoggingInLoading(true);

            const userSession = await createUserSession(email, password);

            if (typeof userSession === 'string') {
                setErrorMsg(userSession);
                return;
            } else {
                console.log('THIS IS USER Sesssion:', userSession);

                localStorage.setItem('authUserId', userSession.userId);
                localStorage.setItem('authUserEmail', userSession.providerUid);

                setUserEmail(userSession.providerUid);
                setUserId(userSession.userId);
                setIsLoggedIn(true);

                loginSuccess = true;

                const user = await getUserByIdQuery(userSession.userId);

                if (user.total > 0) {
                    userExistsInCollection = true;
                }
            }

            console.log('Logged in clicked.');
        } catch (error) {
            console.log('Error logging in user:', error);
            setErrorMsg('Something went wrong. Please try again.');
        } finally {
            setIsLoggingInLoading(false);
            if (loginSuccess && userExistsInCollection) {
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

    if (isLoggedIn) {
        return <LoadingComponent />;
    }

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