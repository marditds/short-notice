import { useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';

export const SignOutOfAllAccounts = ({
    setIsSignOutInProgress,
    setIsAppLoading,
    setUserId,
    setUserEmail,
    setUsername,
    setHasUsername,
    setGivenName,
    setAccountType,
    setUser,
    setIsLoggedIn,
    removeAllSessions
}) => {

    const navigate = useNavigate();

    const onSignOutAllSessionClicked = async () => {

        try {
            setIsSignOutInProgress(true);
            setIsAppLoading(true);

            setUserId(null);
            setUserEmail(null);
            setUsername('');
            setHasUsername(false);
            setGivenName('');
            setAccountType('');
            setUser(null);
            setIsLoggedIn(false);

            localStorage.clear();
            console.log('Storage is cleared.');

            await removeAllSessions();

            console.log('Signed out of all devices successfully.');
            navigate('/');

        } catch (error) {
            console.error('Error signin out of all devices:', error);
        } finally {
            setIsAppLoading(false);
            setIsSignOutInProgress(false);
        }
    }

    return (
        <Row xs={1} sm={2} aria-labelledby='signout-heading'>
            <Col>
                <h4 id='signout-heading'>Sign Out of All Devices</h4>
                <p className='mb-2 mb-sm-0'>
                    Clicking this button will sign you out of all devices where you're currently signed in.
                    This is recommended if you suspect your account may still be active on a shared or unattended device.
                </p>
                <p className='mb-2 mb-sm-0 fw-semibold' id='current-device-note'>
                    To sign out of only this device, use the sign out option in the dropdown menu at the top-right corner of the screen.
                </p>
            </Col>

            <Col className='d-grid align-content-end'>
                <Button
                    onClick={onSignOutAllSessionClicked}
                    className='settings__sign-out-btn'
                    aria-label='Sign out of all devices'
                    aria-describedby='current-device-note'
                >
                    Sign Out of All Devices
                </Button>
            </Col>
        </Row>
    )
}
