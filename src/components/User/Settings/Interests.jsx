import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import { InterestsTags } from './InterestsTags';
import { Loading } from '../../Loading/Loading';

export const Interests = () => {

    const { googleUserData } = useUserContext();
    const { user_id, tagCategories, isInterestsUpdating, selectedTags, fetchUserInterests, updateInterests,
        toggleInterestsTag,
        isInterestsLoading
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
            {
                !isInterestsLoading
                    ?
                    <InterestsTags
                        tagCategories={tagCategories}
                        isInterestsUpdating={isInterestsUpdating}
                        selectedTags={selectedTags}
                        toggleInterestsTag={toggleInterestsTag}
                        updateInterests={updateInterests}
                    />
                    :
                    <Loading />
            }


            {/* <Col className='d-flex'>
                <div className='d-flex flex-column'>
                    <div
                        className='d-flex flex-wrap'
                    >
                        {allTags.map((tag) => (
                            <div
                                key={tag.key}
                                className='settings__update-interests-tag-col' >
                                <div
                                    onClick={() => toggleTag(tag.key)}

                                    className={`settings__update-interests-tag ${selectedTags[tag.key] && 'tagIsChecked'}`}
                                >
                                    {tag.name}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={handleUpdateInterests}
                        className='settings__update-interests-btn'
                    >
                        {isUpdating ? <Loading /> : 'Update Interests'}
                    </Button>
                </div>
            </Col> */}

        </Row>
    )
}
