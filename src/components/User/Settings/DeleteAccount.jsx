import React from 'react';
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { Row, Col, Button } from 'react-bootstrap';


export const DeleteAccount = () => {

    const { googleUserData } = useUserContext();

    const { handleDeleteUser } = useUserInfo(googleUserData);

    const handleDeleteAccount = async () => {
        try {
            await handleDeleteUser();
            console.log('hajoh');
        } catch (error) {
            console.error('User not deleted:', error);
        }

    }

    return (
        <Row>
            <Col>
                <h4>Delete Account:</h4>
                <p>WARNING: Deleting your account will result in the loss of all data, which cannot be recovered. Please proceed with caution.</p>
            </Col>
            <Col>
                <Button
                    as={Link}
                    to='/'
                    onClick={async () => {
                        handleDeleteAccount();
                        localStorage.removeItem('accessToken');
                        googleLogout();
                        console.log('Logged out successfully.');
                        window.location.href = '/';
                    }}
                >
                    Delete Account
                </Button>
            </Col>
        </Row>
    )
}
