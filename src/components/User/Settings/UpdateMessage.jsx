import { Form } from 'react-bootstrap';

export const SuccessMessage = ({ message, id }) => {
    return (
        <>
            {message &&
                <div className='mt-1 mt-md-0 mb-0' id={id} role='alert'>
                    <Form.Text style={{ color: 'var(--main-accent-color-hover)' }}>
                        {message}
                    </Form.Text>
                </div>
            }
        </>
    )
}

export const ErrorMessage = ({ message, id }) => {
    return (
        <>
            {message &&
                <div className='mt-1 mt-md-0 mb-0' id={id} role='alert'>
                    <Form.Text style={{ color: 'var(--main-caution-color)' }}>
                        {message}
                    </Form.Text>
                </div>
            }
        </>
    )
}
