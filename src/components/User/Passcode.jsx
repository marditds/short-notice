import React from 'react';
import { Row, Col, Form, Button } from "react-bootstrap";

export const Passcode = ({ passcode, setPasscode, handlePasscode }) => {

    const onPasscodeChange = (e) => {
        setPasscode(e.target.value);
        console.log(e.target.value);

    }

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
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={handlePasscode}
                    disabled={!passcode}
                >
                    Submit
                </Button>
            </Form>
        </div>
    )
}
