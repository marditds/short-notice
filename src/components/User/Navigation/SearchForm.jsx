import { Form } from 'react-bootstrap';

export const SearchForm = ({ value, onChange, handleOnKeyDown, className, formControlBsClassNames }) => {
    return (
        <Form className={className} role='search' aria-label='Username search form'>
            <Form.Group controlId='userSearch'>
                <Form.Label className='visually-hidden'>Search Username</Form.Label>
                <Form.Control
                    as='textarea'
                    rows={1}
                    placeholder='Username Search'
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleOnKeyDown}
                    className={`tools__search-field ${formControlBsClassNames}`}
                    aria-label='Search by username'
                />
            </Form.Group>
        </Form>
    )
}
