import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import { InterestsTags } from './InterestsTags';
import { Loading } from '../../Loading/Loading';

export const Interests = () => {

    const { googleUserData } = useUserContext();
    const { user_id,
        tagCategories,
        isInterestsUpdating,
        selectedTags,
        isInterestsLoading,
        fetchUserInterests,
        updateInterests,
        toggleInterestsTag,
        deselectAllInterestTags
    } = useNotices(googleUserData);

    useEffect(() => {
        // if (location.pathname === feed or settings)
        fetchUserInterests();
        // else return,
    }, [user_id, tagCategories]);

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4>Update Interests:</h4>
                <p>You decide the kind of notices fetch in your general feed.</p>
            </Col>
            <Col>
                {
                    !isInterestsLoading
                        ?
                        <InterestsTags
                            tagCategories={tagCategories}
                            isInterestsUpdating={isInterestsUpdating}
                            selectedTags={selectedTags}
                            toggleInterestsTag={toggleInterestsTag}
                            deselectAllInterestTags={deselectAllInterestTags}
                            updateInterests={updateInterests}
                        />
                        :
                        <Loading />
                }
            </Col>
        </Row>
    )
}
