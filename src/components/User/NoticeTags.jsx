import { useLocation } from 'react-router-dom';
import { Accordion, Form } from 'react-bootstrap';
import { FaAngleDown } from 'react-icons/fa6';



export const NoticeTags = ({ tagCategories, handleTagSelect, selectedTags }) => {

    const location = useLocation();

    return (
        <Accordion defaultActiveKey={['0']} className='user-profile__tags-accordion'>
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                {tagCategories.map((category, categoryIndex) => (
                    <Accordion.Item eventKey={categoryIndex} key={category.group}>

                        <Accordion.Header className='d-flex w-100'>
                            <FaAngleDown size={20} className='me-3' />
                            {category.group}
                        </Accordion.Header>

                        <Accordion.Body
                            role='group'
                            aria-label={`Select tags for ${category.group}`}
                            className='d-flex flex-wrap justify-content-around w-100 user-profile__tags-accordion-body'
                        >
                            {category.tags.map((tag) => {

                                const isChecked = !!selectedTags[tag.key];

                                return (
                                    <label
                                        key={tag.name}
                                        className={`${location.pathname === '/user/profile/' ? 'mt-1 mt-sm-0' : 'mt-1'} user-profile__notice-tag ${isChecked ? 'tagIsChecked' : ''
                                            }`}
                                        style={{ cursor: 'pointer', userSelect: 'none', margin: '0.25rem' }}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={isChecked}
                                            onChange={() => handleTagSelect(category.group, tag, isChecked)}
                                            className='visually-hidden'
                                        />
                                        <span>{tag.name}</span>
                                    </label>
                                )
                            })}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </fieldset>
        </Accordion>
    );
}
