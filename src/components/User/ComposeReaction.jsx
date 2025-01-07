import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Loading } from '../Loading/Loading';

export const ComposeReaction = ({ reactionText, onReactionTextChange, handleReactSubmission, isSendingReactionLoading, reactionCharCount }) => {

    const reactionCharLimit = 300;

    return (
        <>
            <Form>
                <Form.Group className='mb-3' controlId='reactionField'>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={reactionText}
                        onChange={onReactionTextChange}
                        className="user-profile__form-control"
                        placeholder={`Your reaction text here.`}
                    />
                </Form.Group>
                <div
                    className={`user-profile__notice-char-counter ${reactionCharCount > reactionCharLimit && 'extra'}`}
                >
                    {`${reactionCharCount}/${reactionCharLimit} characters`}
                </div>
            </Form>
            <Button
                onClick={handleReactSubmission}
                className='notice__react-btn'
                disabled={reactionText === '' || reactionCharCount > reactionCharLimit ? true : false}
            >
                {isSendingReactionLoading ? <Loading /> : 'React'}
            </Button>
        </>
    )
}
