import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserSession, getAccount } from '../../lib/context/dbhandler';
import { useUserContext } from '../../lib/context/UserContext';
import { screenUtils } from '../../lib/utils/screenUtils';
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

    const { isSmallScreen, isExtraSmallScreen, isMediumScreen, isLargeScreen } = screenUtils();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAccountGettingCreated, setIsAccountGettingCreated] = useState(false);
    const [isLoggingInLoading, setIsLoggingInLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const onUserLogin = async (event) => {

        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);

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
            isSubmitDisabled={email === '' || password.length < 8}
            alternateRouteText="Don't have an account?"
            alternateRouteLink="/signup"
        />

        // <Container className='mt-5 d-flex flex-column justify-content-center align-items-center'>
        //     <div style={{ width: !isSmallScreen ? '580px' : '100%', }} className='d-flex flex-column justify-content-evenly align-items-center p-4 signup__form--bg'>

        //         {/* Title */}
        //         <Row className='w-100 mb-2'>
        //             <Col
        //                 className='px-0'
        //             >
        //                 <h2
        //                     style={{ maxWidth: '350px' }}
        //                     className={`d-block d-lg-flex align-items-lg-baseline 
        //                   ${!isMediumScreen ? 'ms-0' : 'ms-auto me-auto'}`}
        //                 >
        //                     <span className='signup__form--title--span'>
        //                         Sign in to
        //                     </span>
        //                     <Image src={sn_logo}
        //                         className='ms-0 ms-lg-2 d-block d-lg-inline'
        //                         width={'210'} fluid />
        //                 </h2>
        //             </Col>
        //         </Row>

        //         {/* Form for sign in */}
        //         <Row className='w-100'>
        //             <Form
        //                 onSubmit={onUserLogin} style={{ paddingInline: !isMediumScreen ? '12px' : '0px' }} >

        //                 {formFields.map(({ label, type, value, onChange, controlId }, idx) => (
        //                     <Form.Group
        //                         as={Col}
        //                         key={idx}
        //                         className="mb-3 d-flex flex-column flex-lg-row align-items-center signin__form--field"
        //                         controlId={controlId}
        //                     >
        //                         <Form.Label
        //                             className={`mb-1 mb-lg-0 ${isMediumScreen && 'w-100 d-flex justify-content-start'}`}
        //                             style={{ maxWidth: isMediumScreen && '350px' }}
        //                         >
        //                             {label}
        //                         </Form.Label>
        //                         <Form.Control
        //                             style={{ maxWidth: '350px' }}
        //                             className={`signup__form--field ${!isMediumScreen ? 'ms-auto' : 'ms-auto me-auto'}`}
        //                             type={type}
        //                             value={value}
        //                             onChange={onChange}
        //                         />
        //                     </Form.Group>
        //                 ))}

        //                 {/* Buttons for sign in */}
        //                 <Col
        //                     className={`d-flex flex-column ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`}

        //                     style={{ maxWidth: '350px' }}
        //                 >
        //                     <Button type='submit'
        //                         className={`signup-form__btn me-0 ms-auto ${isExtraSmallScreen && 'w-100'}`}
        //                         disabled={
        //                             (password?.length < 8) ||
        //                             (email === '')}>
        //                         {
        //                             !isLoggingInLoading ? 'Sign in' : <LoadingSpinner />
        //                         }

        //                     </Button>
        //                 </Col>

        //                 {errorMsg &&
        //                     <Col className={`mb-2 ${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`}
        //                         style={{ maxWidth: '350px' }}>
        //                         <Form.Text>
        //                             {errorMsg}
        //                         </Form.Text>
        //                     </Col>
        //                 }

        //             </Form>
        //         </Row>
        //         <Row className='mt-2 w-100'>
        //             <Col className={`${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`} style={{ maxWidth: '350px' }}>
        //                 <p className={`mb-0 me-0 ms-auto`}>
        //                     Don't have an account? <Link to='/signup' className='signup-form__signin-btn'>Sign Up</Link>
        //                 </p>
        //             </Col>
        //         </Row>
        //     </div>
        // </Container>

    )
}

export default SignIn;