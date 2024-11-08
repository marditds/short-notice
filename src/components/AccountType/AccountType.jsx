import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { BsFillPersonFill } from "react-icons/bs";
import { PiBagFill } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";

export const AccountType = ({ setAccountType }) => {

    const [selectedType, setSelectedType] = useState(null);

    const handleSelection = (type) => {
        setAccountType(type);
        setSelectedType(type);
    };


    return (
        <Form.Group className='mb-3' controlId='accountType'>
            <Form.Label>Select Account Type:</Form.Label>
            <div className='d-flex justify-content-evenly'>
                <label
                    className={`d-flex flex-column justify-content-center align-items-center createUsername__accountType--radio ${selectedType === 'personal' ? 'selected' : ''}`}
                    onClick={() => handleSelection('personal')}
                >
                    <BsFillPersonFill size={45} style={{ transition: '0.3' }} color={selectedType === 'personal' ? '' : 'white'} />
                    <Form.Check
                        type='radio'
                        label={'Personal'}
                        id={'Personal'}
                        name='accountType'
                        onChange={() => handleSelection('personal')}
                        className='createUsername__accountType--radio-input'
                    />
                </label>

                <label
                    className={`d-flex flex-column justify-content-center align-items-center createUsername__accountType--radio`}

                >
                    <PiBagFill size={45} />
                    <Form.Check
                        type='radio'
                        label={'Professional'}
                        id={'Professional'}
                        name='accountType'
                        onChange={() => handleSelection('professional')}
                        className='createUsername__accountType--radio-input'
                        disabled
                    />
                </label>

                <label
                    className={`d-flex flex-column justify-content-center align-items-center createUsername__accountType--radio ${selectedType === 'organization' ? 'selected' : ''}`}
                    onClick={() => handleSelection('organization')}
                >
                    <BsBuildings size={45} style={{ transition: '0.3' }} color={selectedType === 'organization' ? '' : 'white'} />
                    <Form.Check
                        type='radio'
                        label={'Organization'}
                        id={'Organization'}
                        name='accountType'
                        onChange={() => handleSelection('organization')}
                        className='createUsername__accountType--radio-input'
                    />
                </label>
            </div>
        </Form.Group>

    )
}