import React, { useState, useEffect } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import GifPicker from 'gif-picker-react';
import { Loading } from '../Loading/Loading';

export const ComposeReaction = ({ reactionText, onReactionTextChange, reactionGif, setReactionGif, handleReactSubmission, isSendingReactionLoading, reactionCharCount }) => {

    const reactionCharLimit = 300;

    // const [reactionGif, setReactionGif] = useState(null);
    const [isGifBtnClicked, setIsGifBtnClicked] = useState(false);

    const handleGifBtn = () => {
        setIsGifBtnClicked((preVal) => !preVal);
    }

    useEffect(() => {
        console.log('reactionGif', reactionGif);
    }, [reactionGif])

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
                    {reactionGif &&
                        <Image src={reactionGif} fluid />
                    }
                    <br />
                    <Button className='py-1 px-2'
                        onClick={handleGifBtn}>
                        <i className='bi bi-filetype-gif' />
                    </Button>
                    {reactionGif &&
                        <Button className='py-1 px-2 ms-2' onClick={() => setReactionGif(null)}>
                            Delete Gif
                        </Button>
                    }

                    {isGifBtnClicked &&
                        <GifPicker
                            tenorApiKey={import.meta.env.VITE_TENOR_API_KEY}
                            onGifClick={(item) => setReactionGif(item.url)}
                        // height="500px" width="50vw"
                        />
                    }
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
