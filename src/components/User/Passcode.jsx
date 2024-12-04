import React from 'react';
import { Row, Col, Form, Button } from "react-bootstrap";

export const Passcode = ({ passcode, setPasscode, checkPasscode }) => {

    const onPasscodeChange = (e) => {
        const input = e.target.value;

        if (/^\d{0,6}$/.test(input)) {
            setPasscode(input);
            console.log(input);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (passcode.length === 6) {
                checkPasscode();
            }
        }
    };

    return (
        <div>
            <Form>
                <Form.Group
                    className="mt-5 mb-3"
                    controlId="formBusinessPasscode">
                    <Form.Label>Passcode: </Form.Label>
                    <Form.Control
                        type="password"
                        value={passcode}
                        onChange={onPasscodeChange}
                        onKeyDown={handleKeyDown}
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={checkPasscode}
                    disabled={passcode.length < 6}
                >
                    Submit
                </Button>
            </Form>
        </div>
    )
}
