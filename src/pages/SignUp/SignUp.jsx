import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuthUser, createUserSession } from '../../lib/context/dbhandler';
import { useUserContext } from '../../lib/context/UserContext';
import sn_logo from '../../assets/sn_long.png';
import { keysProvider } from '../../lib/context/keysProvider';
import TOSList from '../../components/Legal/TOSList';
import CommunityGuidelinesList from '../../components/Support/CommunityGuidelinesList';
import PrivacyList from '../../components/Legal/PrivacyList';
import { TermsModal } from '../../components/User/Modals';
import { SignFormLayout } from '../../components/LoginForm/SignFormLayout';

const SignUp = () => {

    const {
        setUserId,
        setUserEmail,
        setGivenName,
        setUser,
    } = useUserContext();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [easterWish, setEasterWish] = useState('');

    const [isAccountGettingCreated, setIsAccountGettingCreated] = useState(false);
    const [doesEmailExist, setDoesEmailExist] = useState(false);

    const [errorMsg, setErrorMsg] = useState(null);

    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [captchaKey, setCaptchaKey] = useState(null);
    const [captchaSiteKey, setCaptchaSiteKey] = useState(null);
    const [captchaErrorMessage, setCaptchaErrorMessage] = useState(null);

    const [tosCheck, setTosCheck] = useState(false);
    const [commGuideCheck, setCommGuideCheck] = useState(false);
    const [privacyPolicyCheck, setPrivacyPolicyCheck] = useState(false);

    const [showTOSModal, setShowTOSModal] = useState(false);
    const [showCommGuideModal, setShowCommGuideModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const formFields = [
        {
            label: 'Name:',
            type: 'text',
            value: name,
            onChange: (e) => {
                const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                setName(onlyLettersAndSpaces);
            },
            controlId: 'signUpFormName',
        },
        {
            label: 'Email:',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            controlId: 'signUpFormEmail',
        },
        {
            label: 'Password:',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            controlId: 'signUpFormPassword',
        },
    ];


    const onCaptchaChange = (value) => {

        if (value || value !== null) {
            // console.log(value);
            setCaptchaKey(value);
            setIsCaptchaVerified(true);
        }

        if (value === null) {
            setIsCaptchaVerified(false);
        }

    };

    const handleTOSCheck = () => {
        setTosCheck(preVal => !preVal)
    }

    const handleCommGuideCheck = () => {
        setCommGuideCheck(preVal => !preVal)
    }

    const handlePrivacyPolicyCheck = () => {
        setPrivacyPolicyCheck(preVal => !preVal)
    }

    const handleShowTOSModal = () => {
        setShowTOSModal(true);
    }

    const handleCloseTOSModal = () => {
        setShowTOSModal(false);
    }

    const handleShowCommGuideModal = () => {
        setShowCommGuideModal(true);
    }

    const handleCloseCommGuideModal = () => {
        setShowCommGuideModal(false);
    }

    const handleShowPrivacyModal = () => {
        setShowPrivacyModal(true);
    }

    const handleClosePrivacyModal = () => {
        setShowPrivacyModal(false);
    }

    const onEmailPasswordSubmit = async (event) => {
        event.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Name:', name);

        if (easterWish) {
            setErrorMsg('Try again.');
            return;
        }

        let signupSuccess = false;

        try {
            setIsAccountGettingCreated(true);
            const user = await createAuthUser(email, password, name);

            if (typeof user === 'string') {
                setErrorMsg(user);
                setDoesEmailExist(true);
                return;
            } else {
                console.log('THIS IS USER IN SIGN UP:', user);

                await createUserSession(email, password);

                setUserEmail(user.email);
                setUserId(user.$id);
                setGivenName(user.name);
                setUser(user);

                signupSuccess = true;
            }

        } catch (error) {
            console.error('Error creating the auth user account:', error);
            setErrorMsg('Something went wrong. Please try again.');
        } finally {
            setIsAccountGettingCreated(false);
            if (signupSuccess) {
                navigate('/create-account');
            }
        }
    }

    useEffect(() => {
        // console.log('captchaKey:', captchaKey);
        if (isCaptchaVerified === false) {
            setCaptchaKey(null);
        }
    }, [captchaKey, isCaptchaVerified])

    useEffect(() => {
        keysProvider('captcha', setCaptchaSiteKey);
    }, []);

    const agreements = [
        {
            id: 'tosCheckbox',
            textBefore: 'I acknowledge that I have read and fully understand the',
            linkText: 'Terms of Service',
            onClick: handleShowTOSModal,
            onChange: handleTOSCheck,
        },
        {
            id: 'commGuideCheckbox',
            textBefore: 'I acknowledge that I have read and agree to comply with the',
            linkText: 'Community Guidelines',
            onClick: handleShowCommGuideModal,
            onChange: handleCommGuideCheck,
        },
        {
            id: 'privacyPolicyCheckbox',
            textBefore: 'I acknowledge that I have read and consent to the terms of the',
            linkText: 'Privacy Policy',
            onClick: handleShowPrivacyModal,
            onChange: handlePrivacyPolicyCheck,
        },
    ];

    return (
        <SignFormLayout
            type="signup"
            titleText="Sign up for"
            logo={sn_logo}
            onSubmit={onEmailPasswordSubmit}
            formFields={formFields}
            submitButtonText="Continue"
            isLoading={isAccountGettingCreated}
            errorMsg={errorMsg}
            showRecaptcha
            captchaSiteKey={captchaSiteKey}
            onCaptchaChange={onCaptchaChange}
            captchaErrorMessage={captchaErrorMessage}
            agreements={agreements}
            wishValue={easterWish}
            onWishChange={(e) => setEasterWish(e.target.value)}
            isSubmitDisabled={
                (password?.length < 8) ||
                (password?.length > 256) ||
                (name === '') ||
                (email === '') ||
                !isCaptchaVerified ||
                tosCheck !== true ||
                commGuideCheck !== true ||
                privacyPolicyCheck !== true ||
                isAccountGettingCreated
            }
            alternateRouteText="Already have an account?"
            alternateRouteLink="/signin"
        >
            <TermsModal showTermModal={showTOSModal} handleCloseTermModal={handleCloseTOSModal}>
                <TOSList />
            </TermsModal>
            <TermsModal showTermModal={showCommGuideModal} handleCloseTermModal={handleCloseCommGuideModal}>
                <CommunityGuidelinesList />
            </TermsModal>
            <TermsModal showTermModal={showPrivacyModal} handleCloseTermModal={handleClosePrivacyModal}>
                <PrivacyList />
            </TermsModal>
        </SignFormLayout>

        // <Container className='min-vh-100 d-flex flex-column justify-content-center align-items-center'>
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
        //                         Sign up for
        //                     </span>
        //                     <Image src={sn_logo}
        //                         className='ms-0 ms-lg-2 d-block d-lg-inline'
        //                         width={'210'} fluid />
        //                 </h2>
        //             </Col>
        //         </Row>

        //         {/* Form for sign up */}
        //         <Row className='w-100'>
        //             <Form onSubmit={onEmailPasswordSubmit}
        //                 style={{ paddingInline: !isMediumScreen ? '12px' : '0px' }}
        //             >
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

        //                 <Form.Text as='ul' className={`mt-0 ps-3 d-flex flex-column ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`} style={{ maxWidth: '350px' }}>
        //                     <li>You passowrd cannot contain fewer than 8 characters.</li>
        //                     <li>You passowrd cannot contain more than 256 characters.</li>
        //                 </Form.Text>


        //                 {/* ReCAPTCHA */}
        //                 <Col className={`mb-3 d-flex ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`}
        //                     style={{ maxWidth: '350px' }}>
        //                     {
        //                         captchaSiteKey ?
        //                             <div style={{ width: '100%', overflow: 'hidden' }}>
        //                                 <ReCAPTCHA
        //                                     className="hakobos"
        //                                     sitekey={captchaSiteKey}
        //                                     onChange={(value) => onCaptchaChange(value)}
        //                                     onExpired={() => setIsCaptchaVerified(false)}
        //                                     onErrored={() => {
        //                                         setIsCaptchaVerified(false);
        //                                         setCaptchaErrorMessage('ReCAPTCHA verification failed. Please try again.');
        //                                     }}
        //                                 />
        //                             </div> :
        //                             <><LoadingSpinner /> Loading ReCAPTCHA</>
        //                     }
        //                 </Col>
        //                 {
        //                     captchaErrorMessage &&
        //                     <Col className={`mb-3 ${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`}
        //                         style={{ maxWidth: '350px' }}>
        //                         {captchaErrorMessage}
        //                     </Col>
        //                 }

        //                 {/* Checkboxes */}
        //                 {agreements.map(({ id, textBefore, linkText, onClick, onChange }, index) => (
        //                     <Col
        //                         key={id}
        //                         className={`d-flex ${index === 1 ? 'my-1' : index === 2 ? 'mb-1' : ''} ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`}
        //                         style={{ maxWidth: '350px' }}
        //                     >
        //                         <Form.Check
        //                             label={
        //                                 <span className='d-inline'>
        //                                     {textBefore}{' '}
        //                                     <a
        //                                         href='#'
        //                                         onClick={(e) => {
        //                                             e.preventDefault();
        //                                             onClick();
        //                                         }}
        //                                         className='signup__form--terms--btn'
        //                                     >
        //                                         {linkText}
        //                                     </a>
        //                                     .
        //                                 </span>
        //                             }
        //                             type='checkbox'
        //                             id={id}
        //                             onChange={onChange}
        //                             className='signup__form--terms--checkbox d-flex align-items-lg-start'
        //                         />
        //                     </Col>
        //                 ))}

        //                 {/* Buttons for signup */}
        //                 <Col
        //                     className={`d-flex flex-column ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`}

        //                     style={{ maxWidth: '350px' }}
        //                 >
        //                     <Button type='submit'
        //                         disabled={
        //                             (password?.length < 8) ||
        //                             (name === '') ||
        //                             (email === '') ||
        //                             !isCaptchaVerified ||
        //                             tosCheck !== true ||
        //                             commGuideCheck !== true ||
        //                             privacyPolicyCheck !== true ||
        //                             isAccountGettingCreated
        //                         }
        //                         className={`signup-form__btn me-0 ms-auto ${isExtraSmallScreen && 'w-100'}`}
        //                     >
        //                         {!isAccountGettingCreated ? 'Continue' : <LoadingSpinner />}

        //                     </Button>


        //                     <Form.Text>
        //                         <span style={{ color: 'var(--main-caution-color)' }}>{errorMsg}</span>
        //                         {
        //                             doesEmailExist && <Link to='/signin' className='ms-1 signup-form__signin-btn' >Sign in</Link>
        //                         }
        //                     </Form.Text>

        //                 </Col>
        //             </Form>
        //         </Row>

        //         {/* Already have an account? */}
        //         <Row className='mt-3 w-100'>
        //             <Col className={`${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`}
        //                 style={{ maxWidth: '350px' }}>
        //                 <p className={`mb-0 me-0 ms-auto`}>
        //                     Already have an account? <Link to='/signin' className='signup-form__signin-btn'>Sign In</Link>
        //                 </p>
        //             </Col>
        //         </Row>
        //     </div>


        //     {/* TOS Modal */}
        //     <TermsModal showTermModal={showTOSModal} handleCloseTermModal={handleCloseTOSModal}
        //     >
        //         <TOSList />
        //     </TermsModal>

        //     {/* Community Guidelines */}
        //     <TermsModal showTermModal={showCommGuideModal} handleCloseTermModal={handleCloseCommGuideModal}>
        //         <CommunityGuidelinesList />
        //     </TermsModal>

        //     {/* Privacy Policy Modal */}
        //     <TermsModal showTermModal={showPrivacyModal} handleCloseTermModal={handleClosePrivacyModal}>
        //         <PrivacyList />
        //     </TermsModal>

        // </Container> 
    )
}

export default SignUp;