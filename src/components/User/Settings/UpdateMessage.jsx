import React from 'react';
import { Form } from 'react-bootstrap';

export const SuccessMessage = ({ message }) => {
    return (
        <>
            {message &&
                <div className='mt-1 mt-md-2'>
                    <Form.Text style={{ color: 'var(--main-accent-color-hover)' }}>
                        {message}
                    </Form.Text>
                </div>
            }
        </>
    )
}

export const ErrorMessage = ({ message }) => {
    return (
        <>
            {message &&
                <div className='mt-1 mt-md-2'>
                    <Form.Text style={{ color: 'var(--main-caution-color)' }}>
                        {message}
                    </Form.Text>
                </div>
            }
        </>
    )
}
