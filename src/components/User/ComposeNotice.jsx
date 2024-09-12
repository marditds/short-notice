import React, { useState } from 'react';
import { Form, Accordion, Button } from 'react-bootstrap';
import { NoticeTags } from './NoticeTags';
import { Loading } from '../Loading/Loading';
import { FaAngleDown } from "react-icons/fa6";

export const ComposeNotice = ({ noticeText, setNoticeText, duration, setDuration, addNotice, isAddingNotice }) => {

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

    const onTextareaChange = (e) => {
        setNoticeText(e.target.value);
        setCharCount(e.target.value.length);
    }

    const handleNotify = async () => {
        if (noticeText.trim()) {

            await addNotice(noticeText, duration, selectedTags);
            setNoticeText('');
            setSelectedTags({});
            setCharCount(0);

            setTagCategories(prevCategories => prevCategories.map(category => ({
                ...category,
                values: category.values.map(() => false)
            })));
        }
    };

    const hours = Array.from({ length: 7 }, (_, i) => (i + 1) * 24);


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

    const isAnyTagSelected = Object.values(selectedTags).some(Boolean);

    return (
        <Form className='mb-3 user-profile__form'>
            <Form.Group
                className="mb-3 user-profile__form-group"
                controlId="noticeTextarea">
                {/* <Form.Label
                        className="user-profile__form-label">
                        Got a notice to share?
                    </Form.Label> */}
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={noticeText}
                    onChange={onTextareaChange}
                    className="user-profile__form-control"
                    placeholder='Got a notice to share?'
                />
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

            {/* <Accordion
                defaultActiveKey={['0']}
                className='user-profile__tags-accordion'
            >
                {tagCategories.map((category, categoryIndex) => (
                    <Accordion.Item eventKey={categoryIndex} key={category.name}>
                        <Accordion.Header className='d-flex w-100'>
                            <FaAngleDown size={20} className='me-3' />
                            {category.name}
                        </Accordion.Header>
                        <Accordion.Body className='d-flex justify-content-around w-100'>
                            {category.tags.map((tag, tagIndex) => (
                                <NoticeTags
                                    key={tag}
                                    label={tag}
                                    name={`tag${categoryIndex + 1}-${tagIndex}`}
                                    onSelect={(isSelected) => handleTagSelect(category.name, tagIndex, isSelected)}
                                    isChecked={category.values[tagIndex] || false}

                                />
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion> */}


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
