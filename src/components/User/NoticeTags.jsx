import { useLocation } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import { FaAngleDown } from 'react-icons/fa6';



export const NoticeTags = ({ tagCategories, handleTagSelect, selectedTags }) => {

    const location = useLocation();

    return (
        <Accordion defaultActiveKey={['0']} className='user-profile__tags-accordion'>
            {tagCategories.map((category, categoryIndex) => (
                <Accordion.Item eventKey={categoryIndex.toString()} key={category.group}>
                    <Accordion.Header className='d-flex w-100'>
                        <FaAngleDown size={20} className='me-3' />
                        {category.group}
                    </Accordion.Header>

                    <Accordion.Body className='user-profile__tags-accordion-body'>
                        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                            <legend className="visually-hidden">
                                Select tags for {category.group}
                            </legend>
                            <div
                                className='d-flex flex-wrap justify-content-around w-100'
                            >
                                {category.tags.map((tag) => {
                                    const isChecked = !!selectedTags[tag.key];
                                    const inputId = `tag-${category.group}-${tag.key}`;

                                    return (
                                        <div
                                            key={tag.key}
                                            className={`user-profile__notice-tag-wrapper ${location.pathname === '/user/profile/' ? 'mt-1 mt-sm-0' : 'mt-1'}`}
                                            style={{ margin: '0.25rem' }}
                                        >
                                            <input
                                                id={inputId}
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleTagSelect(category.group, tag, isChecked)}
                                                className="visually-hidden user-profile__notice-tag-checkbox"
                                            />
                                            <label
                                                htmlFor={inputId}
                                                className={`user-profile__notice-tag ${isChecked ? 'tagIsChecked' : ''}`}
                                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                            >
                                                {tag.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </fieldset>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
