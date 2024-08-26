import React from 'react';
import { Form } from 'react-bootstrap';


export const Visibility = () => {
    return (
        <Form>
            <Form.Check
                type="switch"
                id="visibility-switch"
                label="Switch to private"
            />
        </Form>
    )
}
