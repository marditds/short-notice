import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useNotices } from '../../../lib/hooks/useNotices';

const Permissions = () => {

    const { user_id, updateUserPermissions, getUserPermissions } = useNotices();

    const [reactionBtnState, setReactionBtnState] = useState(null);
    const [reactionTxtState, setReactionTxtState] = useState(null);

    const [isReactionBtnAllowed, setIsReactionBtnAllowed] = useState(true);
    const [isReactionTxtAllowed, setIsReactionTxtAllowed] = useState(true);

    useEffect(() => {
        const fetchUserPermissions = async () => {
            const res = await getUserPermissions(user_id);

            setReactionBtnState(res.btns_reaction_perm);
            setReactionTxtState(res.txt_reaction_perm);
        }

        fetchUserPermissions();
    }, [user_id])

    useEffect(() => {
        console.log('reactionBtnState', reactionBtnState);
        console.log('reactionTxtState', reactionTxtState);
    }, [reactionBtnState, reactionTxtState])

    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4 className=''>Permissions:</h4>
                {/* <p className='mb-0'>Update your {usrnm && usrnm.toLowerCase()}. The maximum number of characters for your {usrnm && usrnm.toLowerCase()} is 16.</p> */}
            </Col>
            <Col className='mt-3 mt-sm-0 d-flex flex-column justify-content-end align-items-center '>
                <Form
                    as={Row}
                    className='w-100 m-0 flex-column settings__username-form'
                >
                    <Col>
                        <Form.Check
                            type='switch'
                            id='permission-switch'
                            label='Likes and Saves'
                            checked={isReactionBtnAllowed}
                            onChange={() => {
                                const newVal = !isReactionBtnAllowed;
                                setIsReactionBtnAllowed(newVal);
                                updateUserPermissions(user_id, newVal, isReactionTxtAllowed);
                            }}
                        />
                    </Col>
                </Form>
                <Form
                    as={Row}
                    className='w-100 m-0 flex-column settings__username-form'
                >
                    <Col>
                        <Form.Check
                            type='switch'
                            id='permission-switch-text'
                            label='Text reaction'
                            checked={isReactionTxtAllowed}
                            onChange={() => {
                                const newVal = !isReactionTxtAllowed;
                                setIsReactionTxtAllowed(newVal);
                                updateUserPermissions(user_id, isReactionBtnAllowed, newVal);
                            }}
                        />
                    </Col>
                </Form>
            </Col>
        </Row>
    )
}

export default Permissions;