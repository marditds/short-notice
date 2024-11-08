import React from 'react';
import { Form } from 'react-bootstrap';
import { BsFillPersonFill } from "react-icons/bs";
import { PiBagFill } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";

export const AccountType = ({ setAccountType }) => {
    return (
        <Form.Group className='mb-3' controlId='accountType'>
            <Form.Label>Select Account Type:</Form.Label>
            <div className='d-flex justify-content-evenly'>
                <label
                    className='d-flex 
                flex-column 
                justify-content-center 
                align-items-center 
                createUsername__accountType--radio'
                >
                    <BsFillPersonFill size={45} />
                    <Form.Check
                        type='radio'
                        label={'Personal'}
                        id={'Personal'}
                        name='accountType'
                        onChange={() => setAccountType('personal')}
                        className='createUsername__accountType--radio-input'
                    />
                </label>

                <label
                    className='d-flex 
                flex-column 
                justify-content-center 
                align-items-center 
                createUsername__accountType--radio'
                >
                    <PiBagFill size={45} />
                    <Form.Check
                        type='radio'
                        label={'Professional'}
                        id={'Professional'}
                        name='accountType'
                        onChange={() => setAccountType('professional')}
                        className='createUsername__accountType--radio-input'
                        disabled
                    />
                </label>

                <label
                    className='d-flex 
                flex-column 
                justify-content-center 
                align-items-center 
                createUsername__accountType--radio'
                >
                    <BsBuildings size={45} />
                    <Form.Check
                        type='radio'
                        label={'Organization'}
                        id={'Organization'}
                        name='accountType'
                        onChange={() => setAccountType('organization')}
                        className='createUsername__accountType--radio-input'
                    />
                </label>
            </div>
        </Form.Group>

    )
}