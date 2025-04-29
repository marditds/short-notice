import React from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';
import { screenUtils } from '../../lib/utils/screenUtils';
import { LoadingSpinner } from '../Loading/LoadingSpinner';
import './SignFormLayout.css';

export const SignFormLayout = ({
    type,
    titleText,
    logo,
    onSubmit,
    formFields,
    submitButtonText,
    isLoading,
    errorMsg,
    successMsg,
    showRecaptcha = false,
    captchaSiteKey,
    onCaptchaChange,
    captchaErrorMessage,
    agreements = [],
    isSubmitDisabled,
    alternateRouteText,
    alternateRouteLink,
    wishValue,
    onWishChange,
    children,
}) => {

    const { isSmallScreen, isExtraSmallScreen, isMediumScreen } = screenUtils();

    const randomName = React.useMemo(() => {
        return 'rnnm_' + Math.random().toString(36).substring(2, 12);
    }, []);

    const maxColWidth = '350px';

    return (
        <Container
            className={`${type === 'signup' ? 'min-vh-100' : 'mt-5'} 
        d-flex flex-column justify-content-center align-items-center`}>
            <div className='d-flex flex-column justify-content-evenly align-items-center p-4 signup-form--bg' style={{ width: !isSmallScreen ? '580px' : '100%' }}>
                {/* Title */}
                <Row className='w-100 mb-2'>
                    <Col className={`${isMediumScreen ? 'px-0' : ''} d-block d-lg-flex align-items-lg-baseline ${!isMediumScreen ? 'ms-0' : 'ms-auto me-auto'}`} style={{ maxWidth: maxColWidth }}>
                        <h2 className={`d-block d-lg-flex align-items-lg-baseline`}>
                            <span className='signup-form--title--span'>
                                {titleText}
                            </span>
                            <Image src={logo} className='ms-0 ms-lg-2 d-block d-lg-inline' width={'210'} fluid />
                        </h2>
                    </Col>
                </Row>

                {/* Form */}
                <Row className='w-100'>
                    <Form onSubmit={onSubmit} style={{ paddingInline: !isMediumScreen ? '12px' : '0px' }}>

                        {type === 'forgot' &&
                            <Col className={`mb-0 mb-md-0 d-flex ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`} style={{ maxWidth: maxColWidth }}>
                                <p>
                                    Enter the email associated with your ShortNotice account.
                                </p>
                            </Col>}

                        {formFields?.map(({ label, type, value, onChange, controlId }, idx) => (
                            <Form.Group
                                as={Col}
                                key={idx}
                                className='mb-3 d-flex flex-column flex-lg-row align-items-center signin__form--field'
                                controlId={controlId}
                            >
                                <Form.Label
                                    className={`mb-1 mb-lg-0 ${isMediumScreen && 'w-100 d-flex justify-content-start'}`}
                                    style={{ maxWidth: isMediumScreen && maxColWidth, color: 'var(--main-text-color)' }}
                                >
                                    {label}
                                </Form.Label>
                                <Form.Control
                                    className={`signup-form--field ${!isMediumScreen ? 'ms-auto' : 'ms-auto me-auto'}`}
                                    style={{ maxWidth: maxColWidth }}
                                    type={type}
                                    value={value}
                                    onChange={onChange}
                                />
                            </Form.Group>
                        ))}

                        {/* Wish field */}
                        <Form.Group
                            as={Col}
                            controlId={randomName}
                            style={{
                                position: 'absolute',
                                left: '-100vw',
                                top: 'auto'
                            }}
                        >
                            <Form.Label aria-hidden='true'>
                                Are you sure? {randomName}
                            </Form.Label>
                            <Form.Control
                                type='text'
                                name={randomName}
                                tabIndex='-1'
                                aria-hidden='true'
                                autoComplete='off'
                                value={wishValue}
                                onChange={onWishChange}
                                spellCheck='false'
                                autoCorrect='off'
                            />
                        </Form.Group>


                        {type === 'signin' &&
                            <Col
                                className={`mb-2 ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`}
                                style={{ maxWidth: maxColWidth }}
                            >
                                <Form.Text className='text-muted text-end d-flex justify-content-end'>
                                    <Link to='/forgot-password'>
                                        Forgot password?
                                    </Link>
                                </Form.Text>
                            </Col>
                        }

                        {type !== 'forgot' &&
                            <Col className={`mb-0 mb-md-0 d-flex ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`}
                                style={{ maxWidth: maxColWidth }}>
                                <Form.Text className='text-muted'>
                                    <ul className='ps-3'>
                                        <li>Your password must contain at least 8 characters.</li>
                                        <li>Your password must not exceed 256 characters.</li>
                                    </ul>
                                </Form.Text>
                            </Col>
                        }

                        {/* ReCAPTCHA */}
                        {showRecaptcha && (
                            <Col className={`d-flex ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`} style={{ maxWidth: maxColWidth }}>
                                {captchaSiteKey ? (
                                    <ReCAPTCHA
                                        className="hakobos"
                                        sitekey={captchaSiteKey}
                                        onChange={onCaptchaChange}
                                        onExpired={() => onCaptchaChange(null)}
                                        onErrored={() => onCaptchaChange(null)}
                                    />
                                ) : (
                                    <>Loading ReCAPTCHA...</>
                                )}
                            </Col>
                        )}
                        {captchaErrorMessage && (
                            <Col className={`mb-3 ${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`} style={{ maxWidth: maxColWidth }}>
                                {captchaErrorMessage}
                            </Col>
                        )}

                        {agreements.length !== 0 &&
                            <div className='mt-3 mb-3'>
                                {/* Agreements */}
                                {agreements?.map(({ id, textBefore, linkText, onClick, onChange }, index) => (
                                    <Col key={id} className={`mb-1 mb-md-2 ${index !== 0 ? 'my-1' : ''} ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`} style={{ maxWidth: maxColWidth }}>
                                        <Form.Check
                                            type='checkbox'
                                            id={id}
                                            onChange={onChange}
                                            label={
                                                <span>
                                                    {textBefore}
                                                    {' '}
                                                    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className='signup-form--terms--btn'>
                                                        {linkText}
                                                    </a>.
                                                </span>
                                            }
                                            className='signup-form--terms--checkbox'
                                        />
                                    </Col>
                                ))}
                            </div>
                        }


                        {/* Submit button */}
                        <Col className={`d-flex flex-column ${!isMediumScreen ? 'ms-auto' : 'mx-auto'}`} style={{ maxWidth: maxColWidth }}>
                            <Button
                                type='submit'
                                className={`signup-form__btn me-0 ms-auto ${isExtraSmallScreen && 'w-100'}`}
                                disabled={isSubmitDisabled || wishValue !== ''}
                            >
                                {!isLoading ? submitButtonText : <LoadingSpinner />}
                            </Button>
                            {errorMsg &&
                                <Form.Text className='mt-3 text-center'>
                                    <span style={{ color: 'var(--main-caution-color)' }}>
                                        {errorMsg}{' '}
                                        {((type === 'reset') && (errorMsg !== 'Passwords do not match.')) && <Link className='d-block mt-1' to='/forgot-password'>Get a new link</Link>}
                                    </span>
                                </Form.Text>}

                            {successMsg &&
                                <Form.Text className='mt-3 text-center'>
                                    <span style={{ color: 'var(--main-accent-color-hover)' }}>
                                        {successMsg}{' '}
                                        {type === 'reset' && <Link to='/signin'>Sign In</Link>}
                                    </span>
                                </Form.Text>}
                        </Col>
                    </Form>
                </Row>

                {/* Alternate route */}
                {
                    ((type !== 'reset') && (type !== 'forgot')) && <Row className='mt-2 w-100'>
                        <Col className={` pe-0 pe-lg-3 ${!isMediumScreen ? 'd-flex ms-auto' : 'd-flex mx-auto'}`} style={{ maxWidth: maxColWidth }}>
                            <p className='mb-0 me-0 ms-auto'>
                                {alternateRouteText} <Link to={alternateRouteLink} className='signup-form__signin-btn'>{type === 'signup' ? 'Sign In' : 'Sign Up'}</Link>
                            </p>
                        </Col>
                    </Row>
                }

            </div>

            {/* Modals */}
            {children}
        </Container>
    );
};
