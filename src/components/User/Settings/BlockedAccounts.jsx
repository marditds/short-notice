import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUrl } from '../../../lib/utils/avatarUtils';
import defaultAvatar from '../../../assets/default.png';
import { SlClose } from "react-icons/sl";
import { Loading } from '../../Loading/Loading';

export const BlockedAccounts = () => {

    const { googleUserData, username } = useUserContext();
    const { userId,
        getBlockedUsersByUser,
        getUserAccountByUserId,
        deleteBlockUsingBlockedId
    } = useUserInfo(googleUserData);

    const [blockedUsers, setBlockedUsers] = useState(null);
    const [isListLoading, setIsListLoading] = useState(false);

    useEffect(() => {
        const fetchBlockedList = async () => {
            try {
                setIsListLoading(true);

                const blckdLst = await getBlockedUsersByUser(userId);
                console.log(`These are ${username}'s blocked list:`, blckdLst);

                let blockedIdArr = [];

                for (let i = 0; i < blckdLst.length; i++) {
                    blockedIdArr.push(blckdLst[i].blocked_id);
                }

                console.log('blockedIdArr', blockedIdArr);

                let blockedUsers = [];

                for (let i = 0; i < blockedIdArr.length; i++) {

                    const usr = await getUserAccountByUserId(blockedIdArr[i]);

                    console.log('usr', usr);

                    blockedUsers.push(usr);
                }

                console.log('blockedUsers', blockedUsers);

                setBlockedUsers(blockedUsers);

            } catch (error) {
                console.error('Error fetching blocked list', error);
            } finally {
                setIsListLoading(false);
            }
        }
        fetchBlockedList();
    }, [userId])

    const handleDelteBlock = () => {
        console.log('removing block');

    }


    return (
        <Row>
            <Col>
                <h4>Blocked Accounts:</h4>
                <p>You can unblock the accounts by clicking on the 'X' button next to the username.</p>
            </Col>
            <Col className='d-flex flex-wrap gap-2'>
                {isListLoading ?
                    <div><Loading size={24} /></div> :
                    (
                        blockedUsers?.map((user) => {
                            return (
                                <div key={user.$id} className='d-flex justify-content-start  align-items-start'>
                                    <div className='d-flex w-100 align-items-center settings__blocked-accounts-profiles'>
                                        {user.username}
                                        < img src={avatarUrl(user.avatar) || defaultAvatar}
                                            alt="Profile"
                                            style={{ borderRadius: '50%', width: '50px', height: '50px', marginLeft: '12px' }}
                                            className='d-flex'
                                        />
                                        <Button
                                            onClick={handleDelteBlock}
                                            className='p-0' style={{ marginLeft: '12px' }}
                                        >
                                            <SlClose size={24} />
                                        </Button>

                                    </div>
                                </div>
                            )
                        })
                    )
                }

            </Col>
        </Row>
    )
}
