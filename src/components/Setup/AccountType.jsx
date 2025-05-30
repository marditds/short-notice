import React, { useState, useRef } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';
import { PiBagFill } from 'react-icons/pi';
import { AccountTypeDesc } from './AccountTypeDesc';
import { screenUtils } from '../../lib/utils/screenUtils';

export const AccountType = ({ setAccountType, accountType }) => {
    const { isExtraSmallScreen, isSmallScreen } = screenUtils();
    const [selectedType, setSelectedType] = useState(null);

    const personalRef = useRef(null);
    const businessRef = useRef(null);
    const organizationRef = useRef(null);

    const handleSelection = (type) => {
        setAccountType(type);
        setSelectedType(type);
    };

    const handleContainerClick = (ref, type) => {
        if (ref.current && !ref.current.disabled) {
            ref.current.click();
            handleSelection(type);
        }
    };

    const accountTypes = [
        {
            type: 'personal',
            label: 'Personal',
            icon: <BsFillPersonFill size={!isExtraSmallScreen && !isSmallScreen ? 45 : 32} color={selectedType === 'personal' ? 'var(--main-bg-color)' : 'var(--main-text-color)'} style={{ transition: 'var(--main-transition-speed)' }} />,
            disabled: false,
            ref: personalRef
        },
        {
            type: 'business',
            label: 'Business',
            icon: <PiBagFill size={!isExtraSmallScreen && !isSmallScreen ? 45 : 32} color={selectedType === 'business' ? 'var(--main-bg-color)' : 'var(--main-text-color)'} style={{ transition: 'var(--main-transition-speed)' }} />,
            disabled: false,
            ref: businessRef
        },
        {
            type: 'organization',
            label: 'Organization',
            icon: <i className='bi bi-diagram-3-fill' style={{ color: selectedType === 'organization' ? 'var(--main-bg-color)' : 'var(--main-text-color)', fontSize: !isExtraSmallScreen && !isSmallScreen ? '45px' : '32px', transition: 'var(--main-transition-speed)', lineHeight: !isSmallScreen ? '45px' : '32px' }}></i>,
            disabled: false,
            ref: organizationRef
        },
    ];

    return (
        <>
            <Form.Group className='mb-3' controlId='accountType'>
                <fieldset>
                    <legend className='form-label fs-6'>Select Account Type:</legend>
                    <Row xs={2} sm={1}>
                        <Col className='d-flex flex-column flex-sm-row justify-content-evenly' role='radiogroup'
                            aria-labelledby='accountType'>
                            {accountTypes.map((type) => (
                                <div key={type.type}>
                                    <div
                                        className={`mx-1 mx-md-0 d-flex flex-column justify-content-center align-items-center createUsername__accountType--radio ${selectedType === type.type ? 'selected' : ''}`}
                                        onClick={() => handleContainerClick(type.ref, type.type)}
                                        onKeyDown={(e) => {
                                            if (e.key === ' ' || e.key === 'Enter') {
                                                e.preventDefault();
                                                handleContainerClick(type.ref, type.type);
                                            }
                                        }}
                                        tabIndex={type.disabled ? -1 : 0}
                                        role='radio'
                                        aria-checked={selectedType === type.type}
                                        aria-disabled={type.disabled}
                                        aria-labelledby={`radio-label-${type.type}`}
                                    >
                                        <div className='d-flex flex-column align-items-center'>
                                            {type.icon}
                                            <span id={`radio-label-${type.type}`} className='mt-1'>{type.label}</span>
                                        </div>

                                        <input
                                            ref={type.ref}
                                            type='radio'
                                            id={`radio-${type.type}`}
                                            name='accountType'
                                            value={type.type}
                                            checked={selectedType === type.type}
                                            onChange={() => handleSelection(type.type)}
                                            disabled={type.disabled}
                                            className='visually-hidden'
                                        />
                                    </div>
                                </div>
                            ))}
                        </Col>
                        <Col>
                            <AccountTypeDesc accountType={accountType} />
                        </Col>
                    </Row>
                </fieldset>
            </Form.Group>
        </>
    );
};