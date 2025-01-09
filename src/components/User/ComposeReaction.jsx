import React, { useState, useEffect } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import GifPicker from 'gif-picker-react';
import { Loading } from '../Loading/Loading';
import { screenUtils } from '../../lib/utils/screenUtils';

export const ComposeReaction = ({ reactionText, onReactionTextChange, reactionGif, setReactionGif, handleReactSubmission, isSendingReactionLoading, reactionCharCount }) => {

    const { isSmallScreen } = screenUtils();

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
                <Form.Group className='mb-0' controlId='reactionField'>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={reactionText}
                        onChange={onReactionTextChange}
                        className="user-profile__form-control"
                        placeholder={`Your reaction text here.`}
                    />
                    {reactionGif &&
                        <>
                            <Image src={reactionGif}
                                width={!isSmallScreen ? 'auto' : '50%'}
                                className='mt-2'
                                fluid />
                        </>
                    }

                    <div className='my-2'>
                        <Button className='notice__react-gif-btn py-1 px-2'
                            onClick={handleGifBtn}>
                            <i className='bi bi-filetype-gif' />
                        </Button>
                        {reactionGif &&
                            <Button className='notice__react-gif-btn py-1 px-2 ms-2' onClick={() => setReactionGif(null)}>
                                Remove Gif
                            </Button>
                        }
                    </div>

                    {isGifBtnClicked &&
                        <GifPicker
                            tenorApiKey={import.meta.env.VITE_TENOR_API_KEY}
                            onGifClick={(item) => setReactionGif(item.url)}
                            width={!isSmallScreen ? '50vw' : '80vw'} height='400px'
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
                className='notice__react-btn mt-2'
                disabled={reactionText === '' || reactionCharCount > reactionCharLimit ? true : false}
            >
                {isSendingReactionLoading ? <Loading /> : 'React'}
            </Button>
        </>
    )
}
