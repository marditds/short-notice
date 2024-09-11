import React from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { FaAngleDown } from "react-icons/fa6";



export const NoticeTags = ({ tagCategories, handleTagSelect, selectedTags }) => {



    return (
        <Accordion defaultActiveKey={['0']} className='user-profile__tags-accordion'>
            {tagCategories.map((category, categoryIndex) => (
                <Accordion.Item eventKey={categoryIndex} key={category.group}>
                    <Accordion.Header className='d-flex w-100'>
                        <FaAngleDown size={20} className='me-3' />
                        {category.group}
                    </Accordion.Header>
                    <Accordion.Body className='d-flex justify-content-around w-100'>
                        {category.tags.map((tag, tagIndex) => (
                            <div key={tag.name}>
                                <Form.Check
                                    type='radio'
                                    onChange={() => { }}
                                    id={`custom-radio-${tag.name}`}
                                    label={tag.name}
                                    name={`tag${categoryIndex + 1}-${tagIndex}`}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor={`custom-radio-${tag.name}`}
                                    onClick={() => handleTagSelect(category.group, tagIndex, tag, category.values[tag.key])}
                                    className={`user-profile__notice-tag ${selectedTags[tag.key] ? 'tagIsChecked' : ''}`}
                                >
                                    {tag.name}
                                </label>
                            </div>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
