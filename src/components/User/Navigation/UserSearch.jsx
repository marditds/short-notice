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

export const UserSearch = () => {

    const { getAllUsersByString } = useUserInfo();

    const { isExtraSmallScreen } = screenUtils();

    const [navSrchUsrmInUI, setNavSrchUsrmInUI] = useState('');
    const [modalSrchUsrmInUI, setModalSrchUsrmInUI] = useState('');

    // const [searchTerm, setSearchTerm] = useState('');
    const [navUsersResult, setNavUsersResult] = useState([]);
    const [modalUsersResult, setModalUsersResult] = useState([]);
    const [show, setShow] = useState(false);
    const [isResultLoading, setIsResultLoading] = useState(false);

    // nav
    const [navLimit] = useState(7);
    const [lastId, setLastId] = useState(null);
    const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // modal
    const [modalLimit] = useState(7);
    const [lastModalId, setModalLastId] = useState(null);
    const [hasModalMoreProfiles, setHasModalMoreProfiles] = useState(true);
    const [isModalLoadingMore, setIsModalLoadingMore] = useState(false);

    const onNavFieldUserSearchChange = (e) => {
        setModalSrchUsrmInUI('');
        const value = e.target.value;
        if (/^[a-zA-Z]*$/.test(value)) {
            setNavSrchUsrmInUI(value);
        }
    };

    const onModalUserSearchChange = (e) => {
        setNavSrchUsrmInUI('');
        setModalLastId(null);
        const value = e.target.value;
        if (/^[a-zA-Z]*$/.test(value)) {
            setModalSrchUsrmInUI(value);
        }
    };

    // Fetch results from nav search
    const fetchSearchResults = async (searchTerm) => {
        if (!lastId) {
            setIsResultLoading(true);
        }

        try {
            console.log('searchTerm', searchTerm);
            console.log('navLimit:', navLimit);
            console.log('lastId:', lastId);

            const users = await getAllUsersByString(searchTerm, navLimit, lastId);

            console.log('users:', users);

            if (users?.documents !== undefined) {
                setNavUsersResult(prevUsers => {
                    const moreUsers = users.documents?.filter(user =>
                        !prevUsers.some(loadedUser => loadedUser.$id === user.$id)
                    );
                    return [...prevUsers, ...moreUsers];
                });
            }

            if (users?.documents.length < navLimit) {
                console.log('Is users?.documents.length < navLimit?', users?.documents.length + ', ' + navLimit);
                setHasMoreProfiles(false);
            } else {
                console.log('Is users?.documents.length < navLimit?', users?.documents.length + ', ' + navLimit);
                setHasMoreProfiles(true);
                setLastId(users.documents[users.documents.length - 1].$id);
            }

        } catch (error) {
            console.error('Error listing users:', error);
        } finally {
            setIsResultLoading(false);
        }
    }

    // Fetch results from modal search
    const fetchModalSearchResults = async (newSearchTerm = false, searchTerm) => {
        if (!lastModalId) {
            setIsResultLoading(true);
        }

        // if (newSearchTerm === true) {
        //     setModalLastId(null); 
        // }

        try {
            console.log('searchTerm', searchTerm);
            console.log('newSearchTerm', newSearchTerm);
            console.log('navLimit:', modalLimit);
            console.log('lastId:', lastModalId);

            const users = await getAllUsersByString(searchTerm, modalLimit, lastModalId);

            console.log('users:', users);

            if (users?.documents !== undefined) {
                if (newSearchTerm === false) {
                    setModalUsersResult(prevUsers => {
                        const moreUsers = users.documents?.filter(user =>
                            !prevUsers.some(loadedUser => loadedUser.$id === user.$id)
                        );
                        return [...prevUsers, ...moreUsers];
                    });
                } else {
                    console.log('LOGGGGG', users.documents);
                    setModalUsersResult(users.documents);
                }
            }

            if (users?.documents.length < modalLimit) {
                console.log('Is users?.documents.length < navLimit?', users?.documents.length + ', ' + modalLimit);
                setHasMoreProfiles(false);
            } else {
                console.log('Is users?.documents.length < navLimit?', users?.documents.length + ', ' + modalLimit);
                setHasMoreProfiles(true);
                setModalLastId(users.documents[users.documents.length - 1].$id);
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
        console.log('Calling handleShowSearchUsersModal for', navSrchUsrmInUI);
        await fetchSearchResults(navSrchUsrmInUI);
    };

    const handleModalSearch = async () => {
        setHasMoreProfiles(false);
        setNavUsersResult([]);
        setLastId(null);
        setModalLastId(null);
        console.log('Calling handleModalSearch for', modalSrchUsrmInUI);
        await fetchModalSearchResults(true, modalSrchUsrmInUI);
    }

    const handleLoadMoreProfiles = async () => {
        try {
            setIsLoadingMore(true);

            if (navSrchUsrmInUI !== '') {
                console.log('loading for nav');
                await fetchSearchResults(navSrchUsrmInUI);
            }

            if (modalSrchUsrmInUI !== '') {
                console.log('loading for modal');
                await fetchModalSearchResults(false, modalSrchUsrmInUI);
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
        setNavSrchUsrmInUI('');
        setModalSrchUsrmInUI('');
        // setSearchTerm('')
        setNavUsersResult([]);
        setModalUsersResult([]);
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
            if (navSrchUsrmInUI.trim() !== "") {
                if (show) {
                    handleModalSearch();
                } else {
                    handleShowSearchUsersModal();
                }
            }
        }
    }



    return (
        <>
            {/* Search Bar */}
            <div className='mx-2 justify-content-center d-flex align-items-center'>
                <Button
                    onClick={handleShowSearchUsersModal}
                    className='me-2 px-2 tools__search-btn'
                    disabled={(!isExtraSmallScreen && navSrchUsrmInUI === '') ? true : false}
                >
                    <i className='bi bi-search' style={{ color: 'var(--main-text-color)' }} />
                </Button>
                {/* <Button onClick={onTestBtnClick}>Test Btn</Button> */}
                <Form>
                    <Form.Group controlId="userSearch">
                        <Form.Label className='visually-hidden'>Search Username</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder='Username Search'
                            value={navSrchUsrmInUI}
                            onChange={onNavFieldUserSearchChange}
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
                                    value={modalSrchUsrmInUI}
                                    onChange={onModalUserSearchChange}
                                    onKeyDown={handleOnKeyDown}
                                    className='tools__search-field w-100 mb-2'
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            onClick={handleModalSearch}
                            className='ms-2 px-2 tools__search-btn'
                            disabled={(!isExtraSmallScreen && modalSrchUsrmInUI === '') ? true : false}
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
                                (navUsersResult.length > 0 || modalUsersResult.length > 0) ? [...navUsersResult, ...modalUsersResult].map((user) =>
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

                    {navUsersResult.length !== 0 || modalUsersResult.length !== 0 ?
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
