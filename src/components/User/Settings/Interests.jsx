import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import { InterestsTags } from './InterestsTags';
import { Loading } from '../../Loading/Loading';

export const Interests = () => {

    const { userId, userEmail } = useUserContext();
    const {
        tagCategories,
        isInterestsUpdating,
        selectedTags,
        isInterestsLoading,
        fetchUserInterests,
        updateInterests,
        toggleInterestsTag,
        deselectAllInterestTags
    } = useNotices(userEmail);

    useEffect(() => {
        // if (location.pathname === feed or settings)
        fetchUserInterests();
        // else return,
    }, [userId, tagCategories]);

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
