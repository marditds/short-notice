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
        getBlockedUsersByUserByBatch,
        getUserAccountByUserId,
        deleteBlockUsingBlockedId
    } = useUserInfo(googleUserData);

    const [blockedUsers, setBlockedUsers] = useState([]);
    const [isListLoading, setIsListLoading] = useState(false);
    const [isUnblockingLoading, setIsUnblockingLoading] = useState(false);

    const [limit] = useState(3);
    const [offset, setOffset] = useState(0);
    const [hasMoreBlockedProfiles, setHasMoreBlockedProfiles] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);


    const fetchBlockedList = async () => {
        try {
            setIsListLoading(true);

            console.log('limit:', limit);
            console.log('offset:', offset);

            const blckdLst = await getBlockedUsersByUserByBatch(userId, limit, offset);
            console.log(`These are accounts blocked by${username}':`, blckdLst);

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

            blockedUsers.sort((a, b) => a.username.localeCompare(b.username));

            console.log('blockedUsers', blockedUsers);


            if (blockedUsers) {
                setBlockedUsers(prevUsers => {
                    const moreUsers = blockedUsers?.filter(user =>
                        !prevUsers?.some(loadedUser => loadedUser.$id === user.$id)
                    );

                    return [...prevUsers, ...moreUsers];
                });
            } else {
                return 'No results';
            }

            if (blockedUsers?.length < limit) {
                setHasMoreBlockedProfiles(false);
            } else {
                setHasMoreBlockedProfiles(true);
                setOffset(offset + limit);
            }
            // setBlockedUsers(blockedUsers);

        } catch (error) {
            console.error('Error fetching blocked list', error);
        } finally {
            setIsListLoading(false);
        }
    }

    useEffect(() => {
        fetchBlockedList();
    }, [userId])

    const handleLoadMoreProfiles = () => {
        fetchBlockedList();
    }

    const handleDelteBlock = async (blocked_id) => {
        try {
            setIsUnblockingLoading(true);

            console.log('removing block for:', blocked_id);

            await deleteBlockUsingBlockedId(blocked_id);

            await fetchBlockedList();

        } catch (error) {
            console.error('Error removing user from block:', error);
        } finally {
            setIsUnblockingLoading(false);
        }
    }


    return (
        <Row>
            <Col>
                <h4>Blocked Accounts:</h4>
                <p>You can unblock the accounts by clicking on the 'X' button next to the username.</p>
            </Col>
            <Col className='d-flex flex-wrap gap-2'>
                {isListLoading || isUnblockingLoading ?
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
                                            onClick={async () => handleDelteBlock(user.$id)}
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
                {hasMoreBlockedProfiles ?
                    <Button
                        onClick={handleLoadMoreProfiles}
                        disabled={isLoadingMore || !hasMoreBlockedProfiles}
                    >
                        {isLoadingMore ?
                            <><Loading size={24} /> Loading...</>
                            : 'Load More Profiles'}
                    </Button>
                    :
                    'No more profiles'
                }
                {blockedUsers?.length < 1 ? <div>Blocked accounts appear here.</div> : null}
            </Col>
        </Row>
    )
}
