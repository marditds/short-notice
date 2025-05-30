import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserInfo } from '../../../lib/hooks/useUserInfo';
import { getAvatarUrl } from '../../../lib/utils/avatarUtils';
import defaultAvatar from '../../../assets/default.png';
import { screenUtils } from '../../../lib/utils/screenUtils';
import { Button, Modal, Stack } from 'react-bootstrap';
import { UserSearchModal } from '../Modals';
import { SearchForm } from './SearchForm';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';
import { EndAsterisks } from '../EndAsterisks';

export const UserSearch = ({ username }) => {

    const { getAllUsersByString } = useUserInfo();

    const { isExtraSmallScreen } = screenUtils();

    const [show, setShow] = useState(false);
    const [isResultLoading, setIsResultLoading] = useState(false);

    const [srchUsrmInUI, setSrchUsrmInUI] = useState('');
    const [usrnmPlaceholher, setUsrnmPlaceholher] = useState('');
    const [usersResult, setUsersResult] = useState([]);
    const [limit] = useState(11);
    const [lastId, setLastId] = useState(null);

    const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const onNavFieldUserSearchChange = (e) => {
        setLastId(null);
        const value = e.target.value;
        if (/^[a-zA-Z0-9]*$/.test(value)) {
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

    const handleShowSearchUsersModal = async () => {
        setShow(true);
        console.log('Calling handleShowSearchUsersModal for', srchUsrmInUI);
        if (srchUsrmInUI !== '') {
            setUsrnmPlaceholher(srchUsrmInUI);
            if (!isExtraSmallScreen) {
                await fetchSearchResults(true);
            } else {
                return;
            }
        }
    };

    // Search via the btn in the modal
    const handleModalSearch = async () => {
        setHasMoreProfiles(false);
        setUsersResult([]);
        setLastId(null);
        console.log('Calling handleModalSearch for', srchUsrmInUI);
        setUsrnmPlaceholher(srchUsrmInUI);
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
        setUsrnmPlaceholher('');
        setUsersResult([]);
    };

    const handleOnKeyDown = (e) => {
        if (
            !e.key.match(/^[a-zA-Z0-9]$/) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'ArrowLeft' &&
            e.key !== 'ArrowRight' &&
            e.key !== 'Tab'
        ) {
            e.preventDefault();
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            console.log(e.key)
            if (srchUsrmInUI !== '') {
                if (show) {
                    handleModalSearch();
                } else {
                    handleShowSearchUsersModal();
                }
            }
        }

        if (e.key === 'Escape') {
            handleCloseSeachUsersModal();
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
                <SearchForm
                    value={srchUsrmInUI}
                    onChange={onNavFieldUserSearchChange}
                    handleOnKeyDown={handleOnKeyDown}
                    formControlBsClassNames={'d-none d-sm-block ms-2'}
                />
            </div>

            {/* Search results */}
            <UserSearchModal
                show={show}
                handleCloseUserSearchModalFunction={handleCloseSeachUsersModal}
                modalHeaderContent={<>
                    <Modal.Title id='userSearchModalTitle'>
                        {isResultLoading ?
                            `Looking for '${usrnmPlaceholher}'...`
                            :
                            usersResult.length > 0 ?
                                `Results for '${usrnmPlaceholher}'`
                                :
                                'Search Username'
                        }
                    </Modal.Title>
                    <Button
                        className='ms-auto p-0 tools__search--results-modal-close-btn'
                        onClick={handleCloseSeachUsersModal}
                        aria-label='Close user search modal'
                    >
                        <i className='bi bi-x-square' aria-hidden='true' />
                    </Button>
                </>}
                aria-labelledby='userSearchModalTitle'
                aria-modal='true'
                role='dialog'
            >
                {/* Modal Body */}
                <div className='d-flex'>
                    <SearchForm
                        className='w-100'
                        value={srchUsrmInUI}
                        onChange={onNavFieldUserSearchChange}
                        handleOnKeyDown={handleOnKeyDown}
                        formControlBsClassNames='w-100 mb-3'
                    />
                    <Button
                        onClick={handleModalSearch}
                        className='ms-2 px-2 tools__search-btn'
                        disabled={srchUsrmInUI === '' ? true : false}
                        aria-label='Submit username search'
                    >
                        <i className='bi bi-search' aria-hidden='true' />
                    </Button>
                </div>

                <Stack
                    gap={3}
                    direction='horizontal'
                    className='d-flex flex-wrap justify-content-start'
                    aria-live='polite'>
                    {isResultLoading ?
                        <div className='d-block mx-auto'>
                            <LoadingSpinner size={20} color={'var(--main-text-color)'} />
                        </div>
                        :
                        (
                            usersResult.length > 0 ?
                                usersResult.map((user) =>
                                    <div
                                        key={user.$id}
                                        className='tools__search--search-results-profiles'
                                    >
                                        <Link
                                            to={user.username !== username ? `../user/${user.username}` : `../user/profile`}
                                            className='w-100 d-flex align-items-center justify-content-end'
                                            onClick={handleCloseSeachUsersModal}
                                            aria-label={`Go to profile of ${user.username}`}
                                        >
                                            {user?.username}
                                            < img src={getAvatarUrl(user.avatar) || defaultAvatar}
                                                alt={`${user.username}'s avatar`}
                                                className='d-flex tools__search--search-results-profiles-avatar'
                                            />
                                        </Link>
                                    </div>
                                )
                                :
                                usrnmPlaceholher !== '' ?
                                    <p role='alert'>No user found</p>
                                    : null
                        )
                    }
                </Stack>

                {usersResult.length !== 0 ?
                    (
                        hasMoreProfiles ?
                            <Button
                                onClick={handleLoadMoreProfiles}
                                disabled={isLoadingMore || !hasMoreProfiles}
                                className='w-100 tools__search--results-expand-btn'
                                aria-label='Load more user profiles'
                            >
                                {isLoadingMore ?
                                    <LoadingSpinner size={24} color={'var(--main-accent-color)'} />
                                    :
                                    <i className='bi bi-chevron-down tools__search--results-expand-btn-icon' aria-hidden='true' />
                                }
                            </Button>
                            :
                            <div className='text-center'>
                                <EndAsterisks componentName='tools__search' />
                            </div>
                    )
                    : null}
            </UserSearchModal>

        </>
    )
}
