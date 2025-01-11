import React, { useEffect, useState } from 'react';
import { screenUtils } from '../../lib/utils/screenUtils';
import { Form, Button, Image } from 'react-bootstrap';
import { NoticeTags } from './NoticeTags';
import { Loading } from '../Loading/Loading';
import GifPicker from 'gif-picker-react';
// import { FaAngleDown } from "react-icons/fa6";

export const ComposeNotice = ({ noticeText, setNoticeText, duration, noticeType, setDuration, addNotice, isAddingNotice, onNoticeAdded }) => {

    const { isSmallScreen } = screenUtils();

    const [tagCategories, setTagCategories] = useState([
        {
            group: 'STEM',
            tags: [
                { name: 'Science', key: 'science' },
                { name: 'Technology', key: 'technology' },
                { name: 'Engineering', key: 'engineering' },
                { name: 'Math', key: 'math' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Humanities and Arts',
            tags: [
                { name: 'Literature', key: 'literature' },
                { name: 'History', key: 'history' },
                { name: 'Philosophy', key: 'philosophy' },
                { name: 'Music', key: 'music' }
            ],
            values: [false, false, false, false]
        },
        {
            group: 'Social Sciences and Professions',
            tags: [
                { name: 'Medicine', key: 'medicine' },
                { name: 'Economics', key: 'economics' },
                { name: 'Law', key: 'law' },
                { name: 'Political Science', key: 'polSci' },
                { name: 'Sports', key: 'sports' }
            ],
            values: [false, false, false, false, false]
        }
    ]);

    const [selectedTags, setSelectedTags] = useState({});
    const [charCount, setCharCount] = useState(0);
    const charLimit = 300;

    const [noticeGif, setNoticeGif] = useState(null);
    const [isGifBtnClicked, setIsGifBtnClicked] = useState(false);

    const onTextareaChange = (e) => {
        setNoticeText(e.target.value);
        setCharCount(e.target.value.length);
    }

    const handleNotify = async () => {
        if (noticeText.trim()) {

            await addNotice(noticeText, duration, noticeType, selectedTags, noticeGif);
            // onNoticeAdded(newNotice);
            setNoticeText('');
            setNoticeGif(null);
            setSelectedTags({});
            setCharCount(0);
            setDuration(24);

            setTagCategories(prevCategories => prevCategories.map(category => ({
                ...category,
                values: category.values.map(() => false)
            })));
        }
    };

    // const hours = Array.from({ length: 7 }, (_, i) => (i + 1) * 24);
    const hours = [1, 357, 2, 3, 5, 10, 15, 20, 48, 72]

    const handleTagSelect = (categoryGroup, tagIndex, tag, isSelected) => {
        setTagCategories(prevCategories => prevCategories.map(category => {
            if (category.group === categoryGroup) {
                const newValues = [...category.values];
                newValues[tagIndex] = !isSelected;
                return { ...category, values: newValues };
            }
            return category;
        }));

        setSelectedTags(prev => {
            const updatedTags = { ...prev };

            if (updatedTags[tag.key]) {
                delete updatedTags[tag.key];
            } else {
                updatedTags[tag.key] = true;
            }
            return updatedTags;
        });
    };

    const handleGifBtn = () => {
        setIsGifBtnClicked((preVal) => !preVal);
    }

    useEffect(() => {
        console.log('noticeGif', noticeGif);
    }, [noticeGif])

    const isAnyTagSelected = Object.values(selectedTags).some(Boolean);

    return (
        <Form className='mb-3 user-profile__form'>
            <Form.Group
                className="mb-3 user-profile__form-group"
                controlId="noticeTextarea">
                <Form.Control
                    as="textarea"
                    rows={5}
                    value={noticeText}
                    onChange={onTextareaChange}
                    className='user-profile__form-control'
                    placeholder={'Got a notice to share?'}
                />
                {noticeGif &&
                    <div>
                        <div className='position-relative'>
                            <div className='position-absolute d-flex justify-content-end pe-2'
                                style={{ width: !isSmallScreen ? '30%' : '50%' }}
                            >
                                <Button onClick={() => setNoticeGif(null)}
                                    className='mt-3 notice__remove-gif-btn'
                                >
                                    <i className='bi bi-x-square-fill' />
                                </Button>
                            </div>
                            <Image src={noticeGif}
                                width={!isSmallScreen ? '30%' : '50%'}
                                className='mt-2 notice__gif'
                                fluid />
                        </div>
                    </div>
                }
                {/* <br /> */}
                <div className='my-2'>
                    <Button className='notice__gif-btn py-1 px-2'
                        onClick={handleGifBtn}>
                        <i className='bi bi-filetype-gif' />
                    </Button>
                    {/* {noticeGif &&
                        <Button className='notice__gif-btn py-1 px-2 ms-2' onClick={() => setNoticeGif(null)}>
                            Remove Gif
                        </Button>
                    } */}
                </div>

                {isGifBtnClicked &&
                    <GifPicker
                        categoryHeight={70}
                        tenorApiKey={import.meta.env.VITE_TENOR_API_KEY}
                        onGifClick={(item) => setNoticeGif(item.url)}
                        width={!isSmallScreen ? '50vw' : '80vw'}
                    />
                }

                <div
                    className={`user-profile__notice-char-counter ${charCount > charLimit && 'extra'}`}
                >
                    {`${charCount}/${charLimit} characters`}
                </div>
            </Form.Group>

            <h6
                className='mb-2 user-profile__tags-title'>
                Add tags: <span className='small' style={{ color: 'gray' }}>At least 1 required.</span>
            </h6>

            <NoticeTags
                tagCategories={tagCategories}
                handleTagSelect={handleTagSelect}
                selectedTags={selectedTags}
            />

            <br />

            <div
                className='d-flex align-items-center user-profile__timer-settings'>
                <h6
                    className='mb-0 user-profile__timer-label'>
                    Set Notice Timer
                </h6>

                <Form.Select
                    aria-label="notice-timer-hh"
                    className='w-25 mx-2 user-profile__timer-select'
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                >
                    {hours.map(hour => (
                        <option value={hour} key={hour}>
                            {hour}
                        </option>
                    ))}

                </Form.Select>
                <span>hrs</span>

                <Button
                    onClick={handleNotify}
                    disabled={noticeText === '' || isAddingNotice || !isAnyTagSelected || charCount > charLimit}
                    className='ms-auto user-profile__notify-btn'
                >
                    {isAddingNotice ? <Loading /> : 'Notify'}
                </Button>
            </div>

        </Form>
    )
}
