import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import useNotices from '../../../lib/hooks/useNotices';
import { Row, Col, Button, Modal } from 'react-bootstrap';


const Reactions = () => {

    const { googleUserData } = useUserContext();

    const { getUsersData } = useUserInfo(googleUserData);

    const {
        user_id,
        getAllReactions,
        getAllReactionsBySenderId
    } = useNotices(googleUserData);

    const [selectedRecipientId, setSelectedRecipientId] = useState(null);
    const [showRecipientModal, setShowRecipientModal] = useState(false);

    const [userReactions, setUserReactions] = useState([]);
    const [theRecipients, setTheRecipients] = useState([]);


    useEffect(() => {
        const fetchAllReactionsBySenderId = async () => {
            try {
                const allUsers = await getUsersData();
                // console.log('allUsers', allUsers);

                const res = await getAllReactionsBySenderId(user_id);
                // console.log('res', res);

                setUserReactions(res.documents);

                const theRecievers = allUsers.documents.filter((user) =>
                    res.documents.some((res) => user.$id === res.recipient_id)
                );

                setTheRecipients(theRecievers)

            } catch (error) {
                console.error('Error gettig reactions:', error);
            }
        }
        fetchAllReactionsBySenderId();
    }, [user_id])

    const handleShowModal = (recipientId) => {
        setSelectedRecipientId(recipientId);
        setShowRecipientModal(true);
    };

    const handleCloseRecipientModal = () => {
        setShowRecipientModal(false);
        setSelectedRecipientId(null);
    }

    useEffect(() => {
        console.log('userReactions', userReactions);
        console.log('theRecipients', theRecipients);
    }, [user_id, userReactions, theRecipients])


    return (
        <>
            <Row style={{ marginTop: '30px' }}>
                <Col>
                    {theRecipients.map((recipient) => {
                        // Filter reactions for this specific recipient
                        const recipientReactions = userReactions.filter(
                            reaction => reaction.recipient_id === recipient.$id
                        );

                        return (
                            <div key={recipient.$id}>
                                <Button onClick={() => handleShowModal(recipient.$id)}>
                                    {recipient.username}
                                    <span></span>
                                </Button>

                                <Modal
                                    show={showRecipientModal && selectedRecipientId === recipient.$id}
                                    onHide={handleCloseRecipientModal}
                                >
                                    <Modal.Header>
                                        <Modal.Title>Reactions for {recipient.username}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {
                                            recipientReactions.map((reaction) => (
                                                <div key={reaction.$id}>
                                                    {reaction.content}
                                                </div>
                                            ))
                                        }
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={handleCloseRecipientModal}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        );
                    })}
                </Col>
            </Row>

        </>
    )
}

export default Reactions