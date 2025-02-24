import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUrl } from '../../../lib/utils/avatarUtils';
import defaultAvatar from '../../../assets/default.png';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { CgSearch } from "react-icons/cg";
import { SlClose } from "react-icons/sl";
import { Loading } from '../../Loading/Loading';
import { EndAsterisks } from '../EndAsterisks';

export const UserSearch = ({ userId }) => {

    const { getAllUsersByString, getBlockedUsersByUser } = useUserInfo();

    const { isExtraSmallScreen } = screenUtils();

    const [searchUsernameInUI, setSearchUsernameInUI] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
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
            setSearchUsernameInUI(value);
        }
    };

    const fetchSearchResults = async (newSearchTerm = false, searchTerm) => {
        if (!lastId) {
            setIsResultLoading(true);
        }

        try {
            if (newSearchTerm === true) {
                setUsersResult([]);
                setLastId(null);
                console.log('Search terms was new!!!');
            }

            console.log('searchTerm', searchTerm);
            console.log('newSearchTerm', newSearchTerm);
            console.log('limit:', limit);
            console.log('lastId:', lastId);

            const users = await getAllUsersByString(searchTerm, limit, lastId);

            console.log('users:', users);

            if (users?.documents !== undefined) {
                if (newSearchTerm === false) {
                    setUsersResult(prevUsers => {
                        const moreUsers = users.documents?.filter(user =>
                            !prevUsers.some(loadedUser => loadedUser.$id === user.$id)
                        );
                        return [...prevUsers, ...moreUsers];
                    });
                }
                if (newSearchTerm === true) {
                    setUsersResult(users.documents);
                }
            }

            if (users?.documents.length < limit) {
                console.log('Is users?.documents.length < limit?', users?.documents.length + ', ' + limit);
                setHasMoreProfiles(false);
            } else {
                console.log('Is users?.documents.length < limit?', users?.documents.length + ', ' + limit);
                setHasMoreProfiles(true);
                setLastId(users.documents[users.documents.length - 1].$id);
            }

        } catch (error) {
            console.error('Error listing users:', error);
        } finally {
            setIsResultLoading(false);
        }
    }


    useEffect(() => {
        console.log('lastId', lastId);
    }, [lastId])

    const handleShowSearchUsersModal = async () => {
        setShow(true);
        setSearchTerm(searchUsernameInUI);
        await fetchSearchResults(true, searchUsernameInUI);
    };

    const handleLoadMoreProfiles = async () => {
        try {
            setIsLoadingMore(true);
            await fetchSearchResults(false, searchTerm);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }

    const handleCloseSeachUsersModal = () => {
        setShow(false)
        setLastId(null);
        setSearchUsernameInUI('');
        setSearchTerm('')
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
            console.log(e.key)
            if (searchUsernameInUI.trim() !== "") {
                handleShowSearchUsersModal();
            }
        }
    }

    const onTestBtnClick = () => {
        console.log('Test Btn clicked');
    }

    return (
        <>
            {/* Search Bar */}
            <div className='mx-2 justify-content-center d-flex align-items-center'>
                <Button
                    onClick={handleShowSearchUsersModal}
                    // className=' tools__search-btn'
                    className='me-2 px-2 tools__search-btn'
                    disabled={(!isExtraSmallScreen && searchUsernameInUI === '') ? true : false}
                >
                    <i className='bi bi-search' style={{ color: 'var(--main-text-color)' }} />
                </Button>
                <Button onClick={onTestBtnClick}>Test Btn</Button>
                <Form>
                    <Form.Group controlId="userSearch">
                        <Form.Label className='visually-hidden'>Search Username</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder='Username Search'
                            value={searchUsernameInUI}
                            onChange={onUserSearchChange}
                            onKeyDown={handleOnKeyDown}
                            className='tools__search-field d-none d-sm-block'
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
                <Modal.Header className='w-100 pb-0 pb-md-3'>
                    <Modal.Title>Search Username</Modal.Title>
                    <Button
                        className='ms-auto p-0 tools__search--results-modal-close-btn'
                        onClick={handleCloseSeachUsersModal}>
                        <i className='bi bi-x-square' />
                    </Button>
                </Modal.Header>
                <Modal.Body className='tools__search--results-modal-body'>
                    <div className='d-flex'>
                        <Form className='w-100'>
                            <Form.Group controlId="userSearch">
                                <Form.Label className='visually-hidden'>Search Username</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder='Username Search'
                                    value={searchUsernameInUI}
                                    onChange={onUserSearchChange}
                                    onKeyDown={handleOnKeyDown}
                                    className='tools__search-field w-100 mb-2'
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            onClick={() => fetchSearchResults(true, searchUsernameInUI)}
                            className='ms-2 px-2 tools__search-btn'
                            disabled={(!isExtraSmallScreen && searchUsernameInUI === '') ? true : false}
                        >
                            <i className='bi bi-search' />
                        </Button>
                    </div>

                    <Stack
                        gap={3}
                        direction='horizontal'
                        className='d-flex flex-wrap justify-content-start'>
                        {isResultLoading ?
                            <div className='d-block mx-auto'>
                                <Loading size={20} color={'var(--main-text-color)'} />
                            </div>
                            :
                            (
                                usersResult.length > 0 ? usersResult?.map((user) =>
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
                                                className='d-flex tools__search--search-results-profiles-avatar'
                                            />
                                        </Link>
                                    </div>
                                )
                                    :
                                    'No user found')
                        }
                    </Stack>

                    {usersResult.length !== 0 ?
                        (
                            hasMoreProfiles ?
                                <Button
                                    onClick={handleLoadMoreProfiles}
                                    disabled={isLoadingMore || !hasMoreProfiles}
                                    className='w-100 tools__search--results-expand-btn'
                                >
                                    {isLoadingMore ?
                                        <Loading size={24} color={'var(--main-accent-color)'} />
                                        :
                                        <i className='bi bi-chevron-down tools__search--results-expand-btn-icon'></i>
                                    }
                                </Button>
                                :
                                <div className='text-center'>
                                    <EndAsterisks componentName='tools__search' />
                                </div>
                        )
                        : null}

                </Modal.Body>

            </Modal>
        </>
    )
}
