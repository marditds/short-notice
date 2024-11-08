import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BsFillPersonFill, BsBuildings } from "react-icons/bs";
import { PiBagFill } from "react-icons/pi";

export const AccountType = ({ setAccountType }) => {
    const [selectedType, setSelectedType] = useState(null);

    const handleSelection = (type) => {
        setAccountType(type);
        setSelectedType(type);
    };

    const accountTypes = [
        {
            type: 'personal',
            label: 'Personal',
            icon: <BsFillPersonFill size={45} color={selectedType === 'personal' ? 'var(--main-bg-color)' : 'var(--main-text-color)'} style={{ transition: '0.3s' }} />,
            disabled: false,
        },
        {
            type: 'professional',
            label: 'Professional',
            icon: <PiBagFill size={45} color='var( --main-text-muted)' />,
            disabled: true,
        },
        {
            type: 'organization',
            label: 'Organization',
            icon: <BsBuildings size={45} color={selectedType === 'organization' ? 'var(--main-bg-color)' : 'var(--main-text-color)'} style={{ transition: '0.3s' }} />,
            disabled: false,
        },
    ];

    return (
        <Form.Group className='mb-3' controlId='accountType'>
            <Form.Label>Select Account Type:</Form.Label>
            <Row>
                {accountTypes.map((accountType) => (
                    <Col key={accountType.type} className='d-flex justify-content-center'>
                        <label
                            className={`d-flex flex-column justify-content-center align-items-center createUsername__accountType--radio ${selectedType === accountType.type ? 'selected' : ''}`}
                            onClick={() => !accountType.disabled && handleSelection(accountType.type)}
                        >
                            {accountType.icon}
                            <Form.Check
                                type='radio'
                                label={accountType.label}
                                id={accountType.label}
                                name='accountType'
                                onChange={() => handleSelection(accountType.type)}
                                className='createUsername__accountType--radio-input'
                                disabled={accountType.disabled}
                            />
                        </label>
                    </Col>
                ))}
            </Row>
        </Form.Group>
    );
};
