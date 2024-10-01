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
import { ComposeNotice } from '../../../components/User/ComposeNotice.jsx';
import { Loading } from '../../../components/Loading/Loading.jsx';




const OtherUserProfile = () => {

    let { otherUsername } = useParams();
    const navigate = useNavigate();

    const { googleUserData, username } = useUserContext();

    const [currUserId, setCurrUserId] = useState(() => {
        return localStorage.getItem('currUserId') || null;
    });

    const [notices, setNotices] = useState([]);

    const [noticeText, setNoticeText] = useState('');
    const [duration, setDuration] = useState(24);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        getNoticesByUser
    } = useNotices(googleUserData);

    const {
        following,
        // isLoading: userInfoLoading,
        fetchUsersData,
        getUsersData,
        followUser,
        getOtherUserFollowersById,
        getOtherUserFollowingsById
    } = useUserInfo(googleUserData);

    const [spreadNoticesData, setSpreadNoticesData] = useState([]);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const [followersCount, setFollowersCount] = useState(0);
    const [followingsCount, setFollowingsCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);



    const { avatarUrl } = useUserAvatar(currUserId);

    // Get Other User
    useEffect(() => {
        const getCurrUser = async () => {

            setIsLoadingProfile(true);

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

                // setCurrUserId(currUser.$id);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingProfile(false);
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

    // Update following status
    useEffect(() => {
        if (currUserId && following) {
            setIsFollowing(!following[currUserId]);
        }
    }, [currUserId, following]);


    // Fetch other user's followers
    useEffect(() => {
        const fetchOtherUserFollowersById = async () => {
            try {
                const response = await getOtherUserFollowersById(currUserId);

                console.log('getUserFollowersById - length', response.length);
                setFollowersCount(response.length);

            } catch (error) {
                console.error('Failed to fetch user followers:', error);
            }
        }
        fetchOtherUserFollowersById();
    }, [currUserId])

    // Fetch accounts follwed by other user
    useEffect(() => {
        const fetchOtherUserFollowingsById = async () => {
            try {
                const response = await getOtherUserFollowingsById(currUserId);

                console.log('getOtherUserFollowingsById - length', response.length);
                setFollowingsCount(response.length);

            } catch (error) {
                console.error('Failed to fetch user followers:', error);
            }
        }
        fetchOtherUserFollowingsById();
    }, [currUserId])


    const handleFollow = async (currUserId) => {
        if (!currUserId) return;
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
                // followersCount={following ? Object.keys(following).length : 0}
                followersCount={followersCount}
                followingCount={followingsCount}
                isFollowing={isFollowing}
                handleFollow={handleFollow}
            />

            <Tabs
                defaultActiveKey="notices"
                id="justify-tab-example"
                justify
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
                        eventKey='my-notices'
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
                        />
                        : 'No likes yet'}
                </Tab>
            </Tabs>

        </>
    )
}

export default OtherUserProfile;