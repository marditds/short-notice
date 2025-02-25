import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUrl } from '../../../lib/utils/avatarUtils';
import defaultAvatar from '../../../assets/default.png';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';
import { EndAsterisks } from '../EndAsterisks';

export const UserSearch = () => {

    const { getAllUsersByString } = useUserInfo();

    const { isExtraSmallScreen } = screenUtils();

    const [show, setShow] = useState(false);
    const [isResultLoading, setIsResultLoading] = useState(false);

    // nav
    const [srchUsrmInUI, setSrchUsrmInUI] = useState('');
    const [usersResult, setUsersResult] = useState([]);
    const [limit] = useState(7);
    const [lastId, setLastId] = useState(null);

    const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const onNavFieldUserSearchChange = (e) => {
        setLastId(null);
        const value = e.target.value;
        if (/^[a-zA-Z]*$/.test(value)) {
            setSrchUsrmInUI(value);
        }
    };

    // Fetch results
    const fetchSearchResults = async (newSearchTerm = false) => {
        if (!lastId) {
            setIsResultLoading(true);
        }

        try {
            console.log('srchUsrmInUI', srchUsrmInUI);
            console.log('limit:', limit);
            console.log('lastId:', lastId);

            const users = await getAllUsersByString(srchUsrmInUI, limit, lastId);

            console.log('users:', users);

            if (users?.documents !== undefined || users?.documents?.length > 0) {
                if (newSearchTerm === false) {
                    setUsersResult(prevUsers => {
                        const moreUsers = users.documents?.filter(user =>
                            !prevUsers.some(loadedUser => loadedUser.$id === user.$id)
                        );
                        return [...prevUsers, ...moreUsers];
                    });
                } else {
                    console.log('LOGGGGG', users.documents);
                    setUsersResult(users?.documents);
                }
            } else {
                setUsersResult([]);
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
        console.log('Calling handleShowSearchUsersModal for', srchUsrmInUI);
        if (srchUsrmInUI !== '') {
            if (!isExtraSmallScreen) {
                await fetchSearchResults(true);
            } else {
                return;
            }
        }
    };

    const handleModalSearch = async () => {
        setHasMoreProfiles(false);
        setUsersResult([]);
        setLastId(null);
        console.log('Calling handleModalSearch for', srchUsrmInUI);
        await fetchSearchResults(true);
    }

    const handleLoadMoreProfiles = async () => {
        try {
            setIsLoadingMore(true);

            if (srchUsrmInUI !== '') {
                await fetchSearchResults(false);
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }

    const handleCloseSeachUsersModal = () => {
        setShow(false)
        setLastId(null);
        setSrchUsrmInUI('');
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
            if (show) {
                handleModalSearch();
            } else {
                handleShowSearchUsersModal();
            }
        }
    }

    return (
        <>
            {/* Search Bar */}
            <div className='ms-auto ms-sm-0 justify-content-center d-flex align-items-center'>
                <Button
                    onClick={handleShowSearchUsersModal}
                    className='ms-sm-block px-2 tools__search-btn'
                    disabled={(!isExtraSmallScreen && srchUsrmInUI === '') ? true : false}
                >
                    <i className='bi bi-search' style={{ color: 'var(--main-text-color)' }} />
                </Button>
                <Form>
                    <Form.Group controlId="userSearch">
                        <Form.Label className='visually-hidden'>Search Username</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder='Username Search'
                            value={srchUsrmInUI}
                            onChange={onNavFieldUserSearchChange}
                            onKeyDown={handleOnKeyDown}
                            className='tools__search-field d-none d-sm-block ms-2'
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
                <Modal.Header className='w-100 pb-0'>
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
                                    value={srchUsrmInUI}
                                    onChange={onNavFieldUserSearchChange}
                                    onKeyDown={handleOnKeyDown}
                                    className='tools__search-field w-100 mb-3'
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            onClick={handleModalSearch}
                            className='ms-2 px-2 tools__search-btn'
                            disabled={(!isExtraSmallScreen && srchUsrmInUI === '') ? true : false}
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
                                usersResult.length > 0 ? usersResult.map((user) =>
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
