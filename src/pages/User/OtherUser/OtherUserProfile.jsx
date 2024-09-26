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

    const { user_id, userNotices, userSpreads, likedNotices, isLoading, likeNotice, getAllLikedNotices, getNoticesByUser } = useNotices(googleUserData);

    const { getUsersData } = useUserInfo(googleUserData);

    const [spreadNotices, setSpreadNotices] = useState(userSpreads);
    const [likedNoticesData, setLikedNoticesData] = useState([]);

    const { avatarUrl } = useUserAvatar(currUserId);


    // Save currUserId to localStorage
    useEffect(() => {
        if (currUserId) {
            localStorage.setItem('currUserId', currUserId);
        }
    }, [currUserId]);


    // Get Current User
    useEffect(() => {
        const getCurrUser = async () => {
            try {
                const allUsers = await getUsersData();

                // console.log('allUsers:', allUsers.documents);

                const currUser = allUsers.documents.find((user) => user.username === otherUsername);

                // console.log('currUser:', currUser);

                setCurrUserId(currUser.$id);

            } catch (error) {
                console.error(error);
            }
        }
        getCurrUser();
    }, [otherUsername])

    useEffect(() => {
        const fetchUserNotices = async () => {
            try {
                const usrNotices = await getNoticesByUser(currUserId);

                console.log('usrNotices - OtherUserProfile', usrNotices);

                setNotices(usrNotices);

                return usrNotices;
            } catch (error) {
                console.error('Error fetchUserNotices - OtherUserProfile');

            }
        }

        fetchUserNotices();

    }, [otherUsername, currUserId])

    // useEffect(() => {
    //     console.log('notices - OtherUserProfile', notices);
    // })


    const handleLike = async (notice) => {
        await likeNotice(notice.$id, notice.user_id);
        const updatedLikedNotices = await getAllLikedNotices();
        setLikedNoticesData(updatedLikedNotices);
    }


    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;

    useEffect(() => {
        if (otherUsername === username) {
            navigate('/user/profile');
        }
    }, [otherUsername, username, navigate]);


    if (isLoading) {
        return <div><Loading />Loading {otherUsername}'s profile</div>;
    }

    return (
        <>
            <Profile
                username={otherUsername}
                avatarUrl={avatarUrl}
            />

            <Tabs
                defaultActiveKey="notices"
                id="justify-tab-example"
                justify
            >
                <Tab
                    eventKey='notices'
                    title="Notices"
                >
                    <Notices
                        notices={notices}
                        // handleEditNotice={handleEditNotice}
                        // handleDeleteNotice={handleDeleteNotice}
                        eventKey='my-notices'
                    />
                </Tab>
                <Tab
                    eventKey='spreads'
                    title="Spreads"
                >
                    SPREADS TAB
                    {/* <Notices
                        notices={spreadNotices}
                        username={username}
                        likedNotices={likedNotices}
                        handleLike={handleLike}
                    /> */}
                </Tab>
                <Tab
                    eventKey='likes'
                    title="Likes"
                >
                    LIKES TAB
                    {/* <Notices
                        notices={likedNoticesData}
                        username={username}
                        likedNotices={likedNotices}
                        handleLike={handleLike}
                    /> */}
                </Tab>
            </Tabs>

        </>
    )
}

export default OtherUserProfile;