import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import { Row, Col } from 'react-bootstrap';


const Reactions = () => {

    const { googleUserData } = useUserContext();

    const {
        user_id,
        getAllReactions,
        getAllReactionsBySenderId
    } = useNotices(googleUserData);

    const [userReactions, setUserReactions] = useState([]);

    useEffect(() => {
        const fetchAllReactionsBySenderId = async () => {
            try {
                const res = await getAllReactionsBySenderId(user_id);

                setUserReactions(res.documents);

                // console.log(res);

            } catch (error) {
                console.error('Error gettig reactions:', error);
            }
        }
        fetchAllReactionsBySenderId();
    }, [user_id])

    useEffect(() => {
        console.log('userReactions', userReactions);
    }, [user_id, userReactions])


    return (
        <div>
            <Row>
                <Col>
                    {userReactions.map((reaction) => {
                        return (<div key={reaction.$id}>
                            <p>
                                {reaction.content}
                                <span></span>
                            </p>
                        </div>)
                    })
                    }
                </Col>
            </Row>
        </div>
    )
}

export default Reactions