import React from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';

export const Profile = ({ username, avatarUrl, handleFollow, currUserId }) => {

    const location = useLocation();

    return (
        <Row className='user-profile'>
            <Col className='d-grid'>
                <strong style={{ lineHeight: '12pt' }}>Followers</strong>
                <p className='mb-0' style={{ fontSize: '24px' }}>103</p>
                <strong style={{ lineHeight: '12pt' }}>Following</strong>
                <p className='mb-0' style={{ fontSize: '24px' }}>153</p>

            </Col>

            <Col className='w-100 d-grid justify-content-center gap-2'>
                <img src={avatarUrl ? avatarUrl : defaultAvatar} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
                <p className='my-0 text-center'>{username}</p>
            </Col>

            <Col
                className='d-grid gap-0 align-content-between justify-content-end'
            >
                {location.pathname !== '/user/profile' &&
                    <>
                        <Button
                            onClick={() => handleFollow(currUserId)}
                            style={{
                                maxHeight: 'fit-content', maxWidth: 'fit-content'
                            }}
                        >
                            Follow
                        </Button>
                        <Button style={{
                            maxHeight: 'fit-content', maxWidth: 'fit-content', marginLeft: 'auto'
                        }}>
                            Block
                        </Button>
                        <Button style={{
                            maxHeight: 'fit-content', maxWidth: 'fit-content'
                        }}>
                            Report
                        </Button>
                    </>
                }
            </Col>
        </Row>
    )
}
