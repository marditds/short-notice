import { useEffect, useState } from 'react';
import { useUserInfo } from '../../../lib/hooks/useUserInfo';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from './UpdateMessage';

export const UserWebsite = ({
    username,
    userWebsite,
    setUserWebsite
}) => {

    const { updateUserWebsite, getUserByUsername } = useUserInfo();

    const [isUpdatingWebsite, setIsUpdatingWebsite] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleUserWebsiteChange = (e) => {
        let input = e.target.value.replace(/\s/g, '');
        setUserWebsite(input);
    }

    useEffect(() => {
        const gettingUserDetails = async () => {
            try {
                const user = await getUserByUsername(username);

                setUserWebsite(user.website);

            } catch (error) {
                console.error('Error getting user', error);
            }
        };
        if (username) {
            gettingUserDetails();
        }

    }, [username])

    useEffect(() => {
        console.log('userWebsite', userWebsite);
    }, [userWebsite])


    const handleUpdateUserWebsite = async (e) => {

        e.preventDefault();

        try {
            setIsUpdatingWebsite(true);

            let usrWbst = userWebsite;

            if (usrWbst !== '') {
                if (!usrWbst.startsWith('https://') && !usrWbst.startsWith('http://')) {
                    usrWbst = 'https://' + usrWbst;
                }
            } else {
                usrWbst = null;
            }

            const userWebsiteRes = await updateUserWebsite(usrWbst);
            if (typeof userWebsiteRes === 'string') {
                setErrMsg(userWebsiteRes);
                return;
            }

            setUserWebsite(usrWbst);
            setSuccessMsg('Website updated successfully.');

        } catch (error) {
            console.error('Error updating user website:', error);
        } finally {
            setIsUpdatingWebsite(false);
        }
    }

    const handleOnKeyDown = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUpdateUserWebsite(e);
        }
    };

    var websitePlaceholder = (userWebsite === null || userWebsite === undefined || userWebsite === '') ? 'https://' : userWebsite;

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4 className=''>Update Website:</h4>
                <p className='mb-0'>Update your website.</p>
            </Col>
            <Col className='mt-3 mt-sm-0 d-flex justify-content-end align-items-center settings__website-col'>
                <Form
                    as={Row}
                    className='w-100 m-0 flex-column settings__website-form'
                    aria-labelledby='update-website-heading'
                >
                    <Form.Group
                        as={Col}
                        className='pe-sm-0 settings__website-form-group'
                        controlId='websiteField'>
                        <Form.Label className='mb-1 mb-md-2' id='update-website-heading'>
                            Website:
                        </Form.Label>
                        <Form.Control
                            type='url'
                            placeholder={websitePlaceholder}
                            value={userWebsite || ''}
                            onChange={handleUserWebsiteChange}
                            onKeyDown={handleOnKeyDown}
                            className='settings__website-field'
                            aria-describedby='website-help-text'
                        />
                        <Form.Text id='website-help-text' className='visually-hidden'>
                            Please enter a valid URL (e.g., https://example.com).
                        </Form.Text>
                    </Form.Group>
                    <Col className='settings__update-website-btn-col'>
                        <Button
                            disabled={isUpdatingWebsite ? true : false}
                            className='settings__update-website-btn mt-1 mt-md-2'
                            onClick={handleUpdateUserWebsite}>
                            {isUpdatingWebsite ? (
                                <>
                                    <LoadingSpinner /> Updating...
                                    <span className='visually-hidden' role='status' aria-live='polite'>
                                        Updating website...
                                    </span>
                                </>
                            ) : (
                                'Update'
                            )}
                        </Button>

                        <SuccessMessage message={successMsg} />
                        <ErrorMessage message={errMsg} />

                    </Col>
                </Form>
            </Col>
        </Row>
    )
}
