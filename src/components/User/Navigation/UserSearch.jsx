import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUrl } from '../../../lib/utils/avatarUtils';
import defaultAvatar from '../../../assets/default.png';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { CgSearch } from "react-icons/cg";
import { SlClose } from "react-icons/sl";
import { Loading } from '../../Loading/Loading';

export const UserSearch = ({ userId }) => {


    const { getAllUsersByString, getBlockedUsersByUser } = useUserInfo();

    const [searchUsername, setSearchUsername] = useState('');
    const [usersResult, setUsersResult] = useState([]);
    const [show, setShow] = useState(false);
    const [isResultLoading, setIsResultLoading] = useState(false);

    const [limit] = useState(7);
    const [lastId, setLastId] = useState(null);
    const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const onUserSearchChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z]*$/.test(value)) {
            setSearchUsername(value);
        }
    };

    const fetchSearchResults = async () => {
        if (!lastId) {
            setIsResultLoading(true);
        }
        setIsLoadingMore(true);
        try {
            console.log('userIdasasas:', userId);
            console.log('limit:', limit);
            console.log('lastId:', lastId);

            const users = await getAllUsersByString(searchUsername, limit, lastId);

            console.log('users:', users);

            const blockedUsers = await getBlockedUsersByUser(userId);

            console.log('blockedUsers:', blockedUsers);

            const filteredUsers = users.documents.filter((user) =>
                !blockedUsers.some((blocked) => user.$id === blocked.blocked_id)
            );

            console.log('filteredUsers,', filteredUsers);

            if (filteredUsers) {
                setUsersResult(prevUsers => {
                    const moreUsers = filteredUsers?.filter(user =>
                        !prevUsers.some(loadedUser => loadedUser.$id === user.$id)
                    );
                    return [...prevUsers, ...moreUsers];
                });
            } else {
                return 'No results';
            }
            if (filteredUsers?.length < limit) {
                setHasMoreProfiles(false);
            } else {
                setHasMoreProfiles(true);
                setLastId(filteredUsers[filteredUsers.length - 1].$id);
            }
        } catch (error) {
            console.error('Error listing users:', error);
        } finally {
            setIsResultLoading(false);
            setIsLoadingMore(false);
        }
    }

    useEffect(() => {
        console.log('lastId', lastId);
    }, [lastId])

    const handleShowSearchUsersModal = async () => {
        setShow(true);
        await fetchSearchResults();
    };

    const handleLoadMoreProfiles = () => {
        fetchSearchResults();
    }

    const handleCloseSeachUsersModal = () => {
        setShow(false)
        setLastId(null);
        setUsersResult([]);
    };

    const handleOnKeyDown = (e) => {
        if (
            !e.key.match(/^[a-zA-Z]$/) &&
            e.key !== "Backspace" &&
            e.key !== "Delete" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight" &&
            e.key !== "Tab"
        ) {
            e.preventDefault();
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (searchUsername.trim() !== "") {
                handleShowSearchUsersModal();
            }
        }
    }

    return (
        <>
            <div className='d-flex align-items-center'>
                <Button
                    onClick={handleShowSearchUsersModal}
                    className='ms-3 me-1 px-2 tools__search-btn'
                    disabled={searchUsername === '' ? true : false}
                >
                    <CgSearch
                        size={24}
                        color={'var(--main-text-color)'}
                    />
                </Button>
                <Form>
                    <Form.Group controlId="userSearch">
                        <Form.Label className='visually-hidden'>Search Users</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder='User Search'
                            onChange={onUserSearchChange}
                            onKeyDown={handleOnKeyDown}
                            className='tools__search-field'
                        />
                    </Form.Group>
                </Form>
            </div>

            {/* Search results */}
            <Modal
                show={show}
                onHide={handleCloseSeachUsersModal}
                style={{ zIndex: '9999999' }}
                className='tools__search--results-modal'
            >
                <Modal.Header className='w-100'>
                    <Modal.Title>Showing results for "{searchUsername}"</Modal.Title>
                    <Button
                        className='ms-auto p-0 tools__search--results-modal-close-btn'
                        onClick={handleCloseSeachUsersModal}>
                        <SlClose size={32} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Stack
                        gap={3}
                        direction='horizontal'
                        className='d-flex flex-wrap justify-content-start'>
                        {/* <Row className='gx-4'> */}
                        {isResultLoading ?
                            <div><Loading color={'white'} /></div>
                            :
                            (
                                usersResult ? usersResult?.map((user) =>
                                    <div
                                        key={user.$id}
                                        className='tools__search--search-results-profiles'
                                    >
                                        <Link to={`../user/${user.username}`}
                                            className='w-100 d-flex align-items-center justify-content-end'
                                            onClick={handleCloseSeachUsersModal}
                                        >
                                            {user?.username}
                                            < img src={avatarUrl(user.avatar) || defaultAvatar}
                                                alt="Profile"
                                                style={{ borderRadius: '50%', width: 50, height: 50, marginLeft: '12px' }}
                                                className='d-flex'
                                            />
                                        </Link>
                                    </div>
                                )
                                    :
                                    'No user found')
                        }
                        {/* </Row> */}
                    </Stack>
                    {/* {hasMoreProfiles ?
                        <Button
                            onClick={handleLoadMoreProfiles}
                            disabled={isLoadingMore || !hasMoreProfiles}
                            className='tools__search--results-modal-expand-btn'
                        >
                            {isLoadingMore ?
                                <Loading size={24} />
                                :
                                <>

                                    <i className='bi bi-chevron-down'></i>
                                </>
                            }
                        </Button>
                        :
                        'No more profiles'
                    } */}
                    {/* {hasMoreProfiles ?
                        <Button
                            onClick={handleLoadMoreProfiles}
                            disabled={isLoadingMore || !hasMoreProfiles}
                            className='w-100'
                        >
                            {isLoadingMore ?
                                <Loading size={24} />
                                :
                                <div className='tools__search--results-modal-expand-icon d-flex justify-content-evenly align-items-center'>
                                    Load more
                                    <i className='bi bi-chevron-down ms-2'></i>
                                </div>
                            }
                        </Button>
                        :
                        'No more profiles'
                    } */}
                    {hasMoreProfiles ?
                        <Button
                            onClick={handleLoadMoreProfiles}
                            disabled={isLoadingMore || !hasMoreProfiles}
                            className='w-100 expand--btn'
                        >
                            {isLoadingMore ?
                                <Loading size={24} />
                                :
                                <i className='bi bi-chevron-down expand--icon'></i>
                            }
                        </Button>
                        :
                        'No more profiles'
                    }

                </Modal.Body>
                {/* <Modal.Footer className='userhome__body--search-results-modal-footer'> 
                </Modal.Footer> */}
            </Modal>
        </>
    )
}
