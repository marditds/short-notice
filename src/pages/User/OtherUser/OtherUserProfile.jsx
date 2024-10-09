import React, { useState, useEffect, useCallback } from 'react';
import { useParams, redirect, useNavigate } from 'react-router-dom';
import { Profile } from '../../../components/User/Profile.jsx';
import { Notices } from '../../../components/User/Notices.jsx';
import { Tabs, Tab, Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext.jsx';
import useUserInfo from '../../../lib/hooks/useUserInfo.js';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { Loading } from '../../../components/Loading/Loading.jsx';




const OtherUserProfile = () => {

    let { otherUsername } = useParams();
    const navigate = useNavigate();

    const { googleUserData, username } = useUserContext();

    const [currUserId, setCurrUserId] = useState(() => {
        return localStorage.getItem('currUserId') || null;
    });

    const [notices, setNotices] = useState([]);

    const {
        user_id,
        likedNotices,
        spreadNotices,
        isLoading: noticesLoading,
        likeNotice,
        spreadNotice,
        reportNotice,
        getAllLikedNotices,
        getAllSpreadNotices,
        getNoticesByUser,
        sendReaction
    } = useNotices(googleUserData);

    const {
        isFollowingLoading,
        isFollowing,
        followersCount,
        followingCount,
        followersAccounts,
        followingAccounts,
        fetchUsersData,
        getUsersData,
        followUser,
        setIsFollowing,
        fetchAccountsFollowingTheUser,
        fetchAccountsFollowedByUser
    } = useUserInfo(googleUserData);

    const [spreadNoticesData, setSpreadNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl } = useUserAvatar(currUserId);

    // Get Other User
    useEffect(() => {
        const getCurrUser = async () => {

            try {
                const allUsers = await getUsersData();

                // console.log('allUsers:', allUsers.documents);

                const currUser = allUsers.documents.find((user) => user.username === otherUsername);

                // console.log('currUser:', currUser);
                if (currUser) {
                    // Only update if different to prevent unnecessary re-renders
                    setCurrUserId((prevId) => (prevId !== currUser.$id ? currUser.$id : prevId));
                } else {
                    console.error(`User with username "${otherUsername}" not found.`);
                }

            } catch (error) {
                console.error(error);
            }
        }
        getCurrUser();
    }, [otherUsername, getUsersData])


    // Fetch notices for other user
    useEffect(() => {
        const fetchUserNotices = async () => {

            if (!currUserId) return;

            try {
                const usrNotices = await getNoticesByUser(currUserId);

                // console.log('usrNotices - OtherUserProfile', usrNotices);

                setNotices(usrNotices);
                return usrNotices;


            } catch (error) {
                console.error('Error fetchUserNotices - OtherUserProfile');

            }
        }

        fetchUserNotices();

    }, [currUserId, getNoticesByUser])

    useEffect(() => {
        fetchUsersData(spreadNoticesData, setSpreadNoticesData, avatarUtil);
    }, [spreadNoticesData])

    useEffect(() => {
        fetchUsersData(likedNoticesData, setLikedNoticesData, avatarUtil);
    }, [likedNoticesData])


    // Fetch other user likes
    useEffect(() => {
        const fetchLikedNotices = async () => {
            const allLikedNotices = await getAllLikedNotices(currUserId);

            // console.log(`allLikedNotices by ${otherUsername}`, allLikedNotices);

            // console.log('likedNotices:', likedNotices);

            // console.log('username:', username);

            setLikedNoticesData(allLikedNotices);
        };
        fetchLikedNotices();
    }, [currUserId]);

    //Fetch other user spreads
    useEffect(() => {
        const fetchSpreadNotices = async () => {
            const allSpreadNotices = await getAllSpreadNotices(currUserId);

            // console.log(`allSpreadNotices by ${otherUsername}`, allSpreadNotices);

            // console.log('username:', username);

            setSpreadNoticesData(allSpreadNotices);
        };
        fetchSpreadNotices();
    }, [currUserId]);


    const handleLike = async (notice) => {
        try {
            await likeNotice(notice.$id, notice.user_id);
        } catch (error) {
            console.error('Could not like notice');
        }
    }

    const handleSpread = async (notice) => {
        try {
            await spreadNotice(notice.$id, notice.user_id);
        } catch (error) {
            console.error('Error creating spread entry:', error);
        }
    };

    const handleReport = async (notice_id, author_id, reason) => {
        try {
            await reportNotice(notice_id, author_id, reason);
            return 'Report success';
        } catch (error) {
            console.error('Could not report notice');
        }
    }

    const handleReact = async (currUserId, content, notice_id) => {
        try {
            await sendReaction(currUserId, content, notice_id);
            console.log('Success handleReact.');
        } catch (error) {
            console.error('Failed handleReact:', error);
        }
    }


    // Fetch accounts following the other user
    useEffect(() => {
        if (currUserId && user_id) {
            fetchAccountsFollowingTheUser(currUserId, user_id);
        }
    }, [currUserId, user_id])

    // Fetch accounts followed by other user
    useEffect(() => {
        fetchAccountsFollowedByUser(currUserId);
    }, [currUserId])


    const handleFollow = async (currUserId) => {
        try {
            await followUser(currUserId);
            setIsFollowing(prevState => !prevState);
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
        }
    }

    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;

    useEffect(() => {
        if (otherUsername === username) {
            navigate('/user/profile');
        }
    }, [otherUsername, username, navigate]);


    if (noticesLoading) {
        return <div><Loading />Loading {otherUsername}'s profile</div>;
    }

    return (
        <>

            <Profile
                username={otherUsername}
                avatarUrl={avatarUrl}
                currUserId={currUserId}
                followingAccounts={followingAccounts}
                followersAccounts={followersAccounts}
                followersCount={followersCount}
                followingCount={followingCount}
                isFollowing={isFollowing}
                isFollowingLoading={isFollowingLoading}
                handleFollow={handleFollow}
            />


            <Tabs
                defaultActiveKey="notices"
                id="notices-tabs"
                justify
                className='user-profile__notice-tab 
                fixed-bottom
                '
            >
                {/* NOTICES TAB */}
                <Tab
                    eventKey='notices'
                    title="Notices"
                >
                    <Notices
                        notices={notices}
                        likedNotices={likedNotices}
                        spreadNotices={spreadNotices}
                        handleLike={handleLike}
                        handleSpread={handleSpread}
                        handleReport={handleReport}
                        handleReact={handleReact}
                        eventKey='notices'
                    />
                </Tab>

                {/* SPREADS TAB */}
                <Tab
                    eventKey='spreads'
                    title="Spreads"
                >
                    <Notices
                        notices={spreadNoticesData}
                        user_id={user_id}
                        likedNotices={likedNotices}
                        spreadNotices={spreadNotices}
                        handleLike={handleLike}
                        handleSpread={handleSpread}
                        handleReport={handleReport}
                        handleReact={handleReact}
                    />
                </Tab>

                {/* LIKES TAB */}
                <Tab
                    eventKey='likes'
                    title="Likes"
                >
                    {likedNoticesData.length !== 0 ?
                        <Notices
                            notices={likedNoticesData}
                            user_id={user_id}
                            likedNotices={likedNotices}
                            spreadNotices={spreadNotices}
                            handleLike={handleLike}
                            handleSpread={handleSpread}
                            handleReport={handleReport}
                            handleReact={handleReact}
                        />
                        : 'No likes yet'}
                </Tab>
            </Tabs>

        </>
    )
}

export default OtherUserProfile;