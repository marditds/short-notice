import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUtil } from '../../../lib/utils/avatarUtils';
import { Notices } from '../../../components/User/Notices';
import { useUnblockedNotices } from '../../../lib/utils/blockFilter';
import { Button, OverlayTrigger, Tooltip, Form, Row, Col } from 'react-bootstrap';
import { Loading } from '../../../components/Loading/Loading';
import { FaCircleExclamation } from "react-icons/fa6";

const UserFeed = () => {

    const [usersData, setUsersData] = useState([]);

    const [tagCategories, setTagCategories] = useState([
        {
            group: 'STEM',
            tags: [
                { name: 'Science', key: 'science' },
                { name: 'Technology', key: 'technology' },
                { name: 'Engineering', key: 'engineering' },
                { name: 'Math', key: 'math' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Humanities and Arts',
            tags: [
                { name: 'Literature', key: 'literature' },
                { name: 'History', key: 'history' },
                { name: 'Philosophy', key: 'philosophy' },
                { name: 'Music', key: 'music' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Social Sciences and Professions',
            tags: [
                { name: 'Medicine', key: 'medicine' },
                { name: 'Economics', key: 'economics' },
                { name: 'Law', key: 'law' },
                { name: 'Political Science', key: 'polSci' },
                { name: 'Sports', key: 'sports' }
            ],
            values: [false, false, false, false, false]
        }
    ]);

    const [selectedTags, setSelectedTags] = useState({});
    const [isTagSelected, setIsTagSelected] = useState(false);
    const { googleUserData } = useUserContext();

    const {
        user_id,
        likedNotices,
        savedNotices,
        getInterests,
        getFeedNotices,
        saveNotice,
        reportNotice,
        likeNotice,
        sendReaction,
        getReactionsForNotice,
        getReactionByReactionId,
        reportReaction,
        getNoticesByUser,
        fetchUserNotices,
        // noticesReactions, 
        // fetchReactionsForNotices,
        // setNoticesReactions
    } = useNotices(googleUserData);

    const { fetchUsersData, getUserAccountByUserId, fetchAccountsFollowedByUser } = useUserInfo(googleUserData);

    const [feedNotices, setFeedNotices] = useState([]);
    const [personalFeedNotices, setPersonalFeedNotices] = useState([]);

    const { filterBlocksFromFeed } = useUnblockedNotices();

    const [isLoadingFeedNotices, setIsLoadingFeedNotices] = useState(false);
    const [isLoadingPersonalFeedNotices, setIsLoadingPersonalFeedNotices] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Interests Feed
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMoreNotices, setHasMoreNotices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Personal Feed
    const [limitPersonal] = useState(10);
    const [offsetPersonal, setOffsetPersonal] = useState(0);
    const [hasMorePersonalNotices, setHasMorePersonalNotices] = useState(true);
    const [isLoadingMorePersonal, setIsLoadingMorePersonal] = useState(false);

    // Fetch User's interests  
    useEffect(() => {
        const fetchUserInterests = async () => {
            if (user_id) {
                try {
                    const userInterests = await getInterests(user_id);

                    if (userInterests) {
                        setSelectedTags(userInterests);
                    }
                } catch (error) {
                    console.error('Error fetching user interests:', error);
                    // if (error.code === 404) {
                    //     const newSelectedTags = {};
                    //     tagCategories.forEach(category => {
                    //         category.tags.forEach(tag => {
                    //             newSelectedTags[tag.key] = false;
                    //         });
                    //     });
                    //     setSelectedTags(newSelectedTags);
                    // }
                }
            }
        };

        fetchUserInterests();
    }, [user_id, tagCategories]);


    // Fetch User's feed (interests)
    useEffect(() => {
        const fetchFeedData = async () => {
            setIsLoadingFeedNotices(true);
            setIsLoadingUsers(true);
            setIsLoadingMore(true);
            try {
                let falseVal = Object.values(selectedTags).filter((tag) => tag === false);
                // console.log('trueVal', trueVal.indexOf(false, 0));
                // console.log('these are selectedTags:', Object.values(selectedTags));

                function indexOfAll(array, value) {
                    const indices = [];
                    for (let i = 0; i < array.length; i++) {
                        if (array[i] === value) {
                            indices.push(i);
                        }
                    }
                    return indices;
                }

                const indices = indexOfAll(falseVal, false);
                console.log('indices', indices.length);

                if (indices.length < 13) {
                    setIsTagSelected(true);
                } else {
                    setIsTagSelected(false);
                }

                console.log('limit:', limit);
                console.log('offset:', offset);
                const notices = await getFeedNotices(selectedTags, limit, offset);

                console.log('notices', notices);

                const filteredNotices = await filterBlocksFromFeed(notices, user_id);

                console.log('filteredNotices', filteredNotices);

                await fetchUsersData(filteredNotices, setFeedNotices, avatarUtil);

                if (filteredNotices.length < limit) {
                    setHasMoreNotices(false);
                } else {
                    setHasMoreNotices(true);
                }

            } catch (error) {
                console.error('Error fetching feed notices:', error);
            } finally {
                setIsLoadingFeedNotices(false);
                setIsLoadingUsers(false);
                setIsLoadingMore(false);
            }
        };
        fetchFeedData();
    }, [selectedTags, offset]);

    // Fetch feed (the user follows)
    useEffect(() => {
        const fetchPersonalFeed = async () => {
            try {
                setIsLoadingPersonalFeedNotices(true);
                setIsLoadingUsers(true);
                setIsLoadingMorePersonal(true);
                // list the ids that the user follows
                var followedByUser = await fetchAccountsFollowedByUser(user_id);

                console.log('followedByUser', followedByUser);

                var usrNtcs = [];

                const allNotices = await Promise.all(
                    followedByUser.map((user) => getNoticesByUser(user.$id, limitPersonal, offsetPersonal))
                );

                usrNtcs = allNotices.flat();

                usrNtcs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                console.log('usrNtcs', usrNtcs);

                await fetchUsersData(usrNtcs, setPersonalFeedNotices, avatarUtil);

                if (usrNtcs.length < limit) {
                    setHasMorePersonalNotices(false);
                } else {
                    setHasMorePersonalNotices(true);
                }

            } catch (error) {
                console.error('Error fetching personal feed', error);
            } finally {
                setIsLoadingPersonalFeedNotices(false);
                setIsLoadingUsers(true);
                setIsLoadingMorePersonal(false);
            }

        }
        fetchPersonalFeed();
    }, [user_id]);

    useEffect(() => {
        console.log('personalFeedNotices:', personalFeedNotices);
    }, [personalFeedNotices])


    // const handleTagSelect = (categoryName, tagIndex, tag, isSelected) => {

    //     console.log('Tag:', tag.key);

    //     setSelectedTags(prevTags => ({
    //         ...prevTags,
    //         [tag.key]: !prevTags[tag.key]
    //     }));

    // };

    //Fetch reactions to feed notices  
    // useEffect(() => {
    //     try {
    //         fetchReactionsForNotices(feedNotices, setNoticesReactions);
    //     } catch (error) {
    //         console.error(error);
    //     }

    // }, [feedNotices])


    const handleSave = async (notice) => {
        try {
            await saveNotice(notice.$id, notice.user_id, user_id);
        } catch (error) {
            console.error('Error creating save entry:', error);
        }
    };


    const handleLike = async (notice) => {
        try {
            await likeNotice(notice.$id, notice.user_id, user_id)
        } catch (error) {
            console.error('Could not like notice');
        }
    }

    const handleReport = async (notice_id, author_id, reason) => {
        try {
            await reportNotice(notice_id, author_id, reason);
            return 'Report success';
        } catch (error) {
            console.error('Could not report notice');
        }
    }

    const handleReact = async (currUserId, content, notice_id, expiresAt) => {
        try {
            await sendReaction(currUserId, content, notice_id, expiresAt);
            console.log('Success handleReact.');
        } catch (error) {
            console.error('Failed handleReact:', error);
        }
    }


    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };


    // Render loading state while data is being fetched
    if ((isLoadingFeedNotices || isLoadingUsers || isLoadingPersonalFeedNotices) && feedNotices.length === 0) {
        return <div className='mt-5'><Loading size={24} />Loading feed...</div>;
    }

    return (
        <div>


            <h2 style={{ marginTop: '30px' }}>

                {!isTagSelected ?
                    <span>
                        <FaCircleExclamation /> To view notices in your feed, set your interests in your profile <a href='../user/settings'>settings</a>.
                    </span>
                    :
                    <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip>{'Update you interests in your profile settings.'}</Tooltip>}>
                        <Button>
                            <FaCircleExclamation />
                        </Button>
                    </OverlayTrigger>
                }
            </h2>

            {/* Toggle personal and general feed */}
            <Form>
                <Form.Group as={Row} className="align-items-center">
                    <Col xs="auto">
                        <Form.Label className="mb-0">View personal</Form.Label>
                    </Col>

                    <Col xs="auto">
                        <Form.Check
                            type="switch"
                            id="feed-switch"
                            label=""
                            checked={isToggled}
                            onChange={handleToggle}
                        />
                    </Col>

                    <Col xs="auto">
                        <Form.Label className="mb-0">View general</Form.Label>
                    </Col>
                </Form.Group>
            </Form>

            <Notices
                notices={!isToggled ? personalFeedNotices : feedNotices}
                user_id={user_id}
                likedNotices={likedNotices}
                savedNotices={savedNotices}
                // reactions={noticesReactions}
                handleLike={handleLike}
                handleSave={handleSave}
                handleReport={handleReport}
                handleReact={handleReact}
                getReactionsForNotice={getReactionsForNotice}
                getUserAccountByUserId={getUserAccountByUserId}
                getReactionByReactionId={getReactionByReactionId}
                reportReaction={reportReaction}
            />

            {/* Load More Button */}
            <div className="d-flex justify-content-center mt-4">

                <div className="d-flex justify-content-center mt-4">
                    {(!isToggled && hasMorePersonalNotices) || (isToggled && hasMoreNotices) ?
                        <Button
                            onClick={() => { !isToggled ? setOffsetPersonal(offsetPersonal + limitPersonal) : setOffset(offset + limit) }}
                            disabled={(isToggled && (isLoadingMore || !hasMoreNotices)) ||
                                (!isToggled && (isLoadingMorePersonal || !hasMorePersonalNotices))} // Disable if already loading or no more notices
                        >
                            {isLoadingMore || isLoadingMorePersonal ?
                                <><Loading size={24} /> Loading...</>
                                : 'Load More'}
                        </Button>
                        : 'No more notices'}
                </div>

            </div>

        </div>
    )
}

export default UserFeed