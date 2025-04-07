import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import { useUserInfo } from '../../../lib/hooks/useUserInfo';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';

export const UserWebsite = () => {

    const { username, userEmail, userWebsite, setUserWebsite } = useUserContext();

    const {
        updateUserWebsite,
        getUserByUsername
    } = useUserInfo(userEmail);

    const [isUpdatingWebsite, setIsUpdatingWebsite] = useState(false);

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
        gettingUserDetails();
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

            await updateUserWebsite(usrWbst);

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
                    // onSubmit={handleSubmit}
                    className='w-100 m-0 flex-column settings__website-form'
                >
                    <Form.Group
                        as={Col}
                        className='pe-sm-0 settings__website-form-group'
                        controlId='websiteField'>
                        <Form.Label className='mb-1 mb-md-2'>
                            Website:
                        </Form.Label>
                        <Form.Control
                            type='website'
                            placeholder={websitePlaceholder}
                            value={userWebsite || ''}
                            onChange={handleUserWebsiteChange}
                            onKeyDown={handleOnKeyDown}
                            className='settings__website-field'
                        />
                    </Form.Group>
                    <Col className='settings__update-website-btn-col'>
                        <Button
                            type='submit'
                            disabled={isUpdatingWebsite ? true : false}
                            className='settings__update-website-btn mt-1 mt-md-2'
                            onClick={handleUpdateUserWebsite}>
                            {isUpdatingWebsite ? 'Updating...' : 'Update'}
                            {isUpdatingWebsite && <Loading />}
                        </Button>
                    </Col>
                </Form>
            </Col>
        </Row>
    )
}
