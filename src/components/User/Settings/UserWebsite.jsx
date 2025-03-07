import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';

export const UserWebsite = () => {

    const { username, googleUserData } = useUserContext();

    const { userWebsite, setUserWebsite, updateUserWebsite, getUserByUsername } = useUserInfo(googleUserData);

    const [localWebsite, setLocalWebsite] = useState(userWebsite);
    const [isUpdatingWebsite, setIsUpdatingWebsite] = useState(false);

    const handleUserWebsiteChange = (e) => {
        e.preventDefault();
        setUserWebsite(e.target.value);
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

            if (userWebsite !== '') {
                if (!userWebsite.startsWith('https://') && !userWebsite.startsWith('http://')) {
                    var usrWbst = 'https://' + userWebsite;
                    await updateUserWebsite(usrWbst);
                } else {
                    await updateUserWebsite(userWebsite);
                }
            } else {
                await updateUserWebsite(null);
            }

        } catch (error) {
            console.error('Error updating user website:', error);
        } finally {
            setIsUpdatingWebsite(false);
        }
    }

    var websitePlaceholder = (userWebsite === null || userWebsite === undefined || userWebsite === '') ? 'Enter your website' : userWebsite;

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
                        <Form.Label>
                            Website:
                        </Form.Label>
                        <Form.Control
                            type='website'
                            placeholder={websitePlaceholder}
                            value={userWebsite || ''}
                            onChange={handleUserWebsiteChange}
                            className='settings__website-field'
                        />
                    </Form.Group>
                    <Col className='settings__update-website-btn-col'>
                        <Button
                            type='submit'
                            disabled={isUpdatingWebsite ? true : false}
                            className='settings__update-website-btn'
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
