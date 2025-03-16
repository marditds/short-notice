import React, { useState, useEffect } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import GifPicker from 'gif-picker-react';
import { keysProvider } from '../../lib/context/keysProvider';
import { Loading } from '../Loading/Loading';
import { screenUtils } from '../../lib/utils/screenUtils';

export const ComposeReaction = ({ reactionText, onReactionTextChange, reactionGif, setReactionGif, handleReactSubmission, isSendingReactionLoading, reactionCharCount }) => {

    const { isSmallScreen } = screenUtils();

    const reactionCharLimit = 300;

    // const [reactionGif, setReactionGif] = useState(null);
    const [tenorApiKey, setTenorApiKey] = useState(null);

    const [isGifBtnClicked, setIsGifBtnClicked] = useState(false);

    const handleGifBtn = () => {
        setIsGifBtnClicked((preVal) => !preVal);
    }

    useEffect(() => {
        keysProvider('tenor', setTenorApiKey);
    }, []);

    useEffect(() => {
        console.log('reactionGif', reactionGif);
    }, [reactionGif])

    return (
        <>
            <Form>
                <Form.Group className='mb-0' controlId='reactionField'>

                    {/* reaction text field */}
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={reactionText}
                        onChange={onReactionTextChange}
                        className="user-profile__form-control"
                        placeholder={`Your reaction text here.`}
                    />

                    {/* reaction count */}
                    <div
                        className={`mt-2 user-profile__notice-char-counter ${reactionCharCount > reactionCharLimit && 'extra'}`}
                    >
                        {`${reactionCharCount}/${reactionCharLimit} characters`}
                    </div>

                    {/* GIF in UI */}
                    {reactionGif &&
                        <div>
                            <div className='position-relative'>
                                <div className='position-absolute d-flex justify-content-end pe-2'
                                    style={{ width: !isSmallScreen ? '30%' : '50%' }}
                                >
                                    <Button onClick={() => setReactionGif(null)}
                                        className='mt-3 notice__react-remove-gif-btn'
                                    >
                                        <i className='bi bi-x-square-fill' />
                                    </Button>
                                </div>
                                <Image src={reactionGif}
                                    width={!isSmallScreen ? '30%' : '50%'}
                                    className='mt-2 notice__gif'
                                    fluid />
                            </div>
                        </div>
                    }

                    {/* handleGifBtn */}
                    <div className='my-2 d-flex'>
                        <Button className='notice__react-gif-btn py-1 px-2'
                            onClick={handleGifBtn}>
                            <i className='bi bi-filetype-gif' />
                        </Button>

                        <Button
                            onClick={handleReactSubmission}
                            className='notice__reaction-submit-btn ms-auto'
                            disabled={reactionText === '' || reactionCharCount > reactionCharLimit ? true : false}
                        >
                            {isSendingReactionLoading ? <Loading /> : 'React'}
                        </Button>
                    </div>

                    {/* GIF picker */}
                    {(isGifBtnClicked && tenorApiKey) &&
                        <div className='d-flex justify-content-start align-items-center'>
                            <GifPicker
                                tenorApiKey={tenorApiKey}
                                onGifClick={(item) => setReactionGif(item.url)}
                                width={!isSmallScreen ? '50vw' : '80vw'} height='400px'
                            />
                        </div>
                    }
                </Form.Group>
            </Form>

        </>
    )
}
