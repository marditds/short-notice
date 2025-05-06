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

            setIsReactionBtnAllowed(res.btns_reaction_perm);
            setIsReactionTxtAllowed(res.txt_reaction_perm);
        }

        fetchUserPermissions();
    }, [user_id])

    useEffect(() => {
        console.log('reactionBtnState', reactionBtnState);
        console.log('reactionTxtState', reactionTxtState);
    }, [reactionBtnState, reactionTxtState])

    const permissionSwitches = [
        {
            id: 'permission-switch-button',
            label: 'Likes and Saves',
            checked: isReactionBtnAllowed,
            onChange: () => {
                const newVal = !isReactionBtnAllowed;
                setIsReactionBtnAllowed(newVal);
                updateUserPermissions(user_id, newVal, isReactionTxtAllowed);
            }
        },
        {
            id: 'permission-switch-text',
            label: 'Text reaction',
            checked: isReactionTxtAllowed,
            onChange: () => {
                const newVal = !isReactionTxtAllowed;
                setIsReactionTxtAllowed(newVal);
                updateUserPermissions(user_id, isReactionBtnAllowed, newVal);
            }
        }
    ];


    return (
        <Row xs={1} sm={2}>
            <Col>
                <h4 className=''>Permissions:</h4>
                <p className='mb-0'>Control how other users interact with your notices. Permissions are granted by default. To revoke a permission, click or tap the switch.</p>
            </Col>
            <Col className='mt-3 mt-sm-0 d-flex flex-column justify-content-end align-items-center '>
                {permissionSwitches.map((item, index) => (
                    <Form as={Row} className="w-100 m-0 flex-column" key={item.id}>
                        <Col>
                            <Form.Check
                                type="switch"
                                id={item.id}
                                label={item.label}
                                checked={item.checked}
                                onChange={item.onChange}
                                className="settings__permission-switch"
                            />
                        </Col>
                    </Form>
                ))}

                {/* <Form
                    as={Row}
                    className='w-100 m-0 flex-column'
                >
                    <Col>
                        <Form.Check
                            type='switch'
                            id='permission-switch-button'
                            label='Likes and Saves'
                            checked={isReactionBtnAllowed}
                            onChange={() => {
                                const newVal = !isReactionBtnAllowed;
                                setIsReactionBtnAllowed(newVal);
                                updateUserPermissions(user_id, newVal, isReactionTxtAllowed);
                            }}
                            className='settings__permission-switch'
                        />
                    </Col>
                </Form>
                <Form
                    as={Row}
                    className='w-100 m-0 flex-column'
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
                            className='settings__permission-switch'
                        />
                    </Col>
                </Form> */}
            </Col>
        </Row>
    )
}

export default Permissions;