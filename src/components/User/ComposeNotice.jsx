import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { screenUtils } from '../../lib/utils/screenUtils';
import useNotices from '../../lib/hooks/useNotices';
import { Form, Button, Image, Dropdown } from 'react-bootstrap';
import { NoticeTags } from './NoticeTags';
import { Loading } from '../Loading/Loading';
import GifPicker from 'gif-picker-react';

export const ComposeNotice = ({ noticeText, setNoticeText,
    // duration, 
    noticeType,
    // setDuration, 
    addNotice, onGeminiRunClick, isAddingNotice, isGeminiLoading }) => {

    const location = useLocation();

    const { tagCategories, setTagCategories } = useNotices();

    const { isSmallScreen, isMediumScreen } = screenUtils();

    const [selectedTags, setSelectedTags] = useState({});
    const [charCount, setCharCount] = useState(0);
    const charLimit = 300;

    const [noticeGif, setNoticeGif] = useState(null);
    const [isGifBtnClicked, setIsGifBtnClicked] = useState(false);

    const [isTemplateChecked, setIsTemplateChecked] = useState(false);
    const [templateSubject, setTemplateSubject] = useState(null);

    const [noticeUrl, setNoticeUrl] = useState(null);

    const [duration, setDuration] = useState(24);

    const templateItems = ['Last minute notice', 'Rescheduling', 'Cancellation', 'Anniversary wish', 'New product announcement']

    const onTextareaChange = (e) => {
        setNoticeText(e.target.value);
        setCharCount(e.target.value.length);
    }

    const handleNotify = async () => {
        if (noticeText.trim()) {

            await addNotice(noticeText, duration, noticeType, selectedTags, noticeGif, noticeUrl);

            setNoticeText('');
            setNoticeGif(null);
            setNoticeUrl(null);
            setSelectedTags({});
            setCharCount(0);
            setDuration(24);

            setTagCategories(prevCategories => prevCategories.map(category => ({
                ...category,
                values: category.values.map(() => false)
            })));
        }
    };

    const hours = Array.from({ length: 7 }, (_, i) => (i + 1) * 24);
    // const hours = [1, 357, 2, 3, 5, 10, 15, 20, 48, 72]

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

    const onTemplateCheckboxChange = () => {
        setIsTemplateChecked(preVal => !preVal);
    }

    const handleNoticeUrlChange = (e) => {
        setNoticeUrl(e.target.value);
    }

    useEffect(() => {
        console.log('isTemplateChecked', isTemplateChecked);
    }, [isTemplateChecked])

    useEffect(() => {
        console.log('templateSubject', templateSubject);
    }, [templateSubject])

    useEffect(() => {
        console.log('noticeUrl', noticeUrl);
    }, [noticeUrl])

    const isAnyTagSelected = Object.values(selectedTags).some(Boolean);

    return (
        <Form className='user-profile__form'>
            <Form.Group
                className="mb-3 user-profile__form-group"
                controlId="noticeTextarea">

                {/* Text field */}
                <Form.Control
                    as='textarea'
                    rows={5}
                    value={noticeText}
                    onChange={onTextareaChange}
                    className='user-profile__form-control'
                    placeholder={'Got a notice to share?'}
                />

                {/* Notice URL */}
                {/* <Form.Label>
                    URL:
                </Form.Label> */}
                <Form.Control
                    type='url'
                    name='noticeURL'
                    value={noticeUrl}
                    onChange={handleNoticeUrlChange}
                    className='user-profile__form-control'
                />

                {/* Character count & template checkbox */}
                <div
                    className={`user-profile__notice-char-counter ${charCount > charLimit && 'extra'} d-flex`}
                >
                    {`${charCount}/${charLimit} characters`}

                    <Form.Check
                        inline
                        label='Use template'
                        type='checkbox'
                        checked={isTemplateChecked}
                        onChange={onTemplateCheckboxChange}
                        className='ms-auto z-1 mb-0 me-0'
                        style={{ minHeight: '0' }}
                    />
                </div>

                {/* GIF */}
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

                {/* GIF & AI Button */}
                <div className='my-2 d-flex'>
                    <Button className='notice__gif-btn py-1 px-2'
                        onClick={handleGifBtn}>
                        <i className='bi bi-filetype-gif' />
                    </Button>

                    <Button className='notice__ai-btn mx-2 py-1 px-2'
                        onClick={() => {
                            console.log('Button clicked, templateSubject:', templateSubject);
                            onGeminiRunClick(templateSubject);
                        }}
                    // onClick={() => onGeminiRunClick()}
                    >
                        {!isGeminiLoading ?
                            <i className='bi bi-stars' />
                            :
                            <Loading />
                        }
                    </Button>

                    {isTemplateChecked &&
                        <Dropdown>
                            <Dropdown.Toggle className='notice__tepmlate-dropdown-btn' id='dropdown-template'>
                                <i className='bi bi-paragraph me-1' />
                                <span>
                                    Template
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    templateItems.map((templateItem, idx) => {
                                        return (
                                            <Dropdown.Item
                                                key={idx}
                                                as={'div'}
                                                onClick={() => setTemplateSubject(templateItem)}
                                            >
                                                {templateItem}
                                            </Dropdown.Item>
                                        )
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>}
                </div>

                {isGifBtnClicked &&
                    <GifPicker
                        categoryHeight={70}
                        tenorApiKey={import.meta.env.VITE_TENOR_API_KEY}
                        onGifClick={(item) => setNoticeGif(item.url)}
                        width={!isSmallScreen ? (!isMediumScreen && location.pathname === '/user/profile' ? '50%' : '80%') : '100%'}
                    />
                }
            </Form.Group>

            {/* Tags */}
            <h6
                className='mb-2 user-profile__tags-title'>
                Add tags <i className='bi bi-tag' />: <span className='small' style={{ color: 'gray' }}>At least 1 required.</span>
            </h6>

            <NoticeTags
                tagCategories={tagCategories}
                handleTagSelect={handleTagSelect}
                selectedTags={selectedTags}
            />

            {/* Timer */}
            <div
                className='my-4 d-flex align-items-center user-profile__timer-settings'>
                <h6
                    className='mb-0 user-profile__timer-label'>
                    Set Notice Timer
                </h6>

                <Form.Select
                    aria-label="notice-timer-hh"
                    className='w-25 ms-2 me-1 user-profile__timer-select'
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                >
                    {hours.map(hour => (
                        <option value={hour} key={hour}>
                            {hour}
                        </option>
                    ))}

                </Form.Select>
                <span className='me-1'>hrs</span>

                <Button
                    onClick={handleNotify}
                    disabled={noticeText === '' || isAddingNotice || !isAnyTagSelected || charCount > charLimit}
                    className='ms-auto user-profile__notify-btn'
                >
                    {isAddingNotice ? <Loading /> : 'Notify'}
                </Button>
            </div>

        </Form >
    )
}
