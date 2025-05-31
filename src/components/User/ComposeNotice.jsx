import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { keysProvider } from '../../lib/context/keysProvider';
import { screenUtils } from '../../lib/utils/screenUtils';
import { useNotices } from '../../lib/hooks/useNotices';
import { Form, Button, Image } from 'react-bootstrap';
import { NoticeTags } from './NoticeTags';
import { LoadingSpinner } from '../Loading/LoadingSpinner';
import GifPicker from 'gif-picker-react';

export const ComposeNotice = ({ noticeText, setNoticeText,
    // duration, 
    noticeType,
    // setDuration, 
    addNotice, onGeminiRunClick, isAddingNotice, isGeminiLoading }) => {

    const location = useLocation();

    const { tagCategories, templateItems, setTagCategories } = useNotices();

    const { isSmallScreen, isMediumScreen } = screenUtils();

    const [selectedTags, setSelectedTags] = useState({});
    const [charCount, setCharCount] = useState(0);
    const charLimit = 300;

    const [tenorApiKey, setTenorApiKey] = useState(null);

    const [noticeGif, setNoticeGif] = useState(null);
    const [isGifBtnClicked, setIsGifBtnClicked] = useState(false);

    const [isTemplateChecked, setIsTemplateChecked] = useState(false);
    const [templateSubject, setTemplateSubject] = useState(null);

    const [noticeUrl, setNoticeUrl] = useState(null);

    const [duration, setDuration] = useState(24);

    const onTextareaChange = (e) => {
        setNoticeText(e.target.value);
        setCharCount(e.target.value.length);
    }

    const handleNotify = async () => {
        if (noticeText.trim()) {

            var urlInNotice = noticeUrl;

            console.log('urlInNotice', urlInNotice);
            console.log('typeof (urlInNotice)', typeof (urlInNotice));


            if (noticeUrl !== null) {
                if (!urlInNotice.startsWith('https://') && !urlInNotice.startsWith('http://')) {
                    console.log('Adding https!');
                    urlInNotice = 'https://' + urlInNotice;
                    setNoticeUrl(null);
                } else {
                    console.log('Not adding https!');
                    urlInNotice = noticeUrl;
                    setNoticeUrl(null);
                }
            }

            await addNotice(noticeText, duration, noticeType, selectedTags, noticeGif, urlInNotice);

            setNoticeText('');
            setNoticeGif(null);
            setNoticeUrl(null);
            setSelectedTags({});
            setCharCount(0);
            setDuration(24);

            setTagCategories(prevCategories =>
                prevCategories?.map(category => ({
                    ...category,
                    values: Object.fromEntries(
                        Object.keys(category.values || {}).map(key => [key, false])
                    )
                }))
            );

        }
    };

    const hours = Array.from({ length: 7 }, (_, i) => (i + 1) * 24);
    // const hours = [1, 357, 2, 3, 5, 10, 15, 20, 48, 72]

    const handleTagSelect = (categoryGroup, tag, isSelected) => {
        setTagCategories(prevCategories =>
            prevCategories?.map(category => {
                if (category.group === categoryGroup) {
                    const newValues = { ...category.values };
                    newValues[tag.key] = !isSelected;
                    return { ...category, values: newValues };
                }
                return category;
            })
        );

        setSelectedTags(prev => {
            const updatedTags = { ...prev };
            if (isSelected) {
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

    const onNoticeUrlChange = (e) => {
        var url = e.target.value.trim();

        if (url === '') {
            setNoticeUrl(null);
        } else {
            setNoticeUrl(url);
        }
    }

    useEffect(() => {
        keysProvider('tenor', setTenorApiKey);
    }, []);

    useEffect(() => {
        console.log('tenorApiKey', tenorApiKey);
    }, [tenorApiKey]);

    useEffect(() => {
        console.log('noticeUrl', noticeUrl);
    }, [noticeUrl])

    const isAnyTagSelected = Object.values(selectedTags).some(Boolean);

    return (
        <Form className='user-profile__form'>
            <Form.Group
                className='mb-2 mb-md-3 user-profile__form-group'>

                {/* Text field */}
                <Form.Control
                    as='textarea'
                    rows={5}
                    value={noticeText}
                    onChange={onTextareaChange}
                    className='user-profile__form-control'
                    placeholder={'Got a notice to share?'}
                    aria-label='Notice text input'
                    id='notice-textarea'
                />

                {/* Notice URL */}
                <Form.Control
                    type='url'
                    name='noticeURL'
                    value={noticeUrl ?? ''}
                    onChange={onNoticeUrlChange}
                    className='user-profile__form-control my-2'
                    placeholder='https://'
                    id='notice-url'
                    aria-label='Optional URL for your notice'
                />

                {/* Character count & template checkbox */}
                <div
                    className={`user-profile__notice-char-counter ${charCount > charLimit && 'extra'} d-flex`}
                >

                    {/* Template checkbox */}
                    <Form.Check
                        inline
                        id='use-template-checkbox'
                        label='Use template'
                        type='checkbox'
                        checked={isTemplateChecked}
                        onChange={onTemplateCheckboxChange}
                        className='ms-0 z-1 mb-0 me-0 notice__template-checkbox'
                        style={{ minHeight: '0' }}
                        aria-label='Toggle use of notice template'
                    />

                    {/* Character count */}
                    <span className='ms-auto' aria-live='polite'
                        aria-atomic='true'>
                        {`${charCount}/${charLimit} characters`}
                    </span>
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
                                    aria-label='Remove selected GIF'
                                >
                                    <i className='bi bi-x-square-fill' />
                                </Button>
                            </div>
                            <Image src={noticeGif}
                                width={!isSmallScreen ? '30%' : '50%'}
                                className='mt-2 notice__gif'
                                fluid
                                alt='Selected GIF for your notice'
                            />
                        </div>
                    </div>
                }

                {/* GIF, AI Button, Template selection */}
                <div className='my-2 d-flex'>

                    {/* Template selection */}
                    <Form.Select
                        className='notice__template-dropdown-btn'
                        id='dropdown-for-notice-template'
                        value={templateSubject || ''}
                        disabled={!isTemplateChecked}
                        onChange={(e) => setTemplateSubject(e.target.value)}
                        aria-label='Select a template for your notice'
                    >
                        <option value='' disabled>Select a Template</option>
                        {templateItems[noticeType]?.map((templateItem, idx) => (
                            <option key={idx} value={templateItem}>
                                {templateItem}
                            </option>
                        ))}
                    </Form.Select>

                    {/* AI Button */}
                    <Button className='notice__ai-btn mx-2 py-1 px-2'
                        onClick={() => {
                            console.log('Button clicked, templateSubject:', templateSubject);
                            onGeminiRunClick(templateSubject);
                        }}
                        disabled={!isTemplateChecked}
                        aria-label='Generate notice text using AI'
                    >
                        {!isGeminiLoading ?
                            <i className='bi bi-stars' />
                            :
                            <LoadingSpinner />
                        }
                    </Button>

                    {/* GIF Button */}
                    <Button className='notice__gif-btn ms-auto py-1 px-2'
                        onClick={handleGifBtn}
                        aria-label='Add a GIF to your notice'
                    >
                        <i className='bi bi-filetype-gif' />
                    </Button>

                </div>

                {/* Gif picker */}
                {(isGifBtnClicked && tenorApiKey) &&
                    <div className='d-flex justify-content-end align-items-center'>
                        <GifPicker
                            categoryHeight={70}
                            tenorApiKey={tenorApiKey}
                            onGifClick={(item) => setNoticeGif(item.url)}
                            width={!isSmallScreen ? (!isMediumScreen && location.pathname === '/user/profile' ? '50%' : '80%') : '100%'}
                        />
                    </div>
                }
            </Form.Group>

            {/* Tags */}
            <h6
                className='mb-2 user-profile__tags-title'>
                Add tags <i className='bi bi-tag' aria-hidden='true' />: <span className='small' style={{ color: 'gray' }}>At least 1 required.</span>
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
                    htmlFor='notice-timer-select'
                    className='mb-0 user-profile__timer-label'>
                    Set Notice Timer
                </h6>

                <Form.Select
                    id='notice-timer-select'
                    className='w-25 ms-2 me-1 user-profile__timer-select'
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    aria-label='Select duration for notice timer in hours'
                >
                    <option>0.15</option>
                    {hours?.map(hour => (
                        <option value={hour} key={hour}>
                            {hour}
                        </option>
                    ))}

                </Form.Select>
                <span className='me-1' aria-hidden='true'>hrs</span>

                <Button
                    onClick={handleNotify}
                    disabled={noticeText === '' || isAddingNotice || !isAnyTagSelected || charCount > charLimit}
                    className='ms-auto user-profile__notify-btn'
                >
                    {isAddingNotice ?
                        <>
                            <LoadingSpinner />
                            <span className='visually-hidden' aria-live='polite' role='status'>
                                Loading...
                            </span>
                        </>
                        : 'Notify'}
                </Button>
            </div>

        </Form >
    )
}
