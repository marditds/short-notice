import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BsFillPersonFill } from "react-icons/bs";
import { PiBagFill } from "react-icons/pi";
import { AccountTypeDesc } from './AccountTypeDesc';
import { screenUtils } from '../../lib/utils/screenUtils';

export const AccountType = ({ setAccountType, accountType }) => {

    const { isSmallScreen } = screenUtils();

    const [selectedType, setSelectedType] = useState(null);

    const handleSelection = (type) => {
        setAccountType(type);
        setSelectedType(type);
    };

    const accountTypes = [
        {
            type: 'personal',
            label: 'Personal',
            icon: <BsFillPersonFill size={!isSmallScreen ? 45 : 32} color={selectedType === 'personal' ? 'var(--main-bg-color)' : 'var(--main-text-color)'} style={{ transition: 'var(--main-transition-speed)' }} />,
            disabled: false,
        },
        {
            type: 'business',
            label: 'Business',
            icon: <PiBagFill size={!isSmallScreen ? 45 : 32} color={selectedType === 'personal' ? 'var(--main-bg-color)' : 'var(--main-text-color)'} style={{ transition: 'var(--main-transition-speed)' }} />,
            disabled: false,
        },
        {
            type: 'organization',
            label: 'Organization',
            icon: <i className='bi bi-diagram-3-fill' style={{ color: selectedType === 'organization' ? 'var(--main-bg-color)' : 'var(--main-text-color)', fontSize: !isSmallScreen ? '45px' : '32px', transition: 'var(--main-transition-speed)', lineHeight: !isSmallScreen ? '45px' : '32px' }}></i>,
            disabled: false,
        },
    ];

    return (
        <>
            <Form.Group className='mb-3' controlId='accountType'>
                <Form.Label>Select Account Type:</Form.Label>
                <Row xs={2} sm={1}>
                    <Col className='d-flex flex-column flex-sm-row justify-content-evenly'>
                        {accountTypes.map((accountType) => (
                            <div key={accountType.type}
                            >
                                <label
                                    className={`mx-1 mx-md-0 d-flex flex-column justify-content-center align-items-center createUsername__accountType--radio ${selectedType === accountType.type ? 'selected' : ''}`}
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
                            </div>
                        ))}
                    </Col>
                    <Col>
                        <AccountTypeDesc accountType={accountType} />
                    </Col>
                </Row>
            </Form.Group>
        </>
    );
};
