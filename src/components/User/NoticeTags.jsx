import { useState } from "react";
import { Form } from 'react-bootstrap';


export const NoticeTags = ({ label, name, onSelect, isChecked }) => {


    const handleCheckChange = () => {
        console.log(`${label} clicked.`);
        onSelect(isChecked);
    }


    return (
        <div>
            <Form.Check
                type='radio'
                onChange={() => { }}
                id={`custom-radio-${label}`}
                label={label}
                name={name}
                style={{ display: 'none' }}
            />
            <label
                htmlFor={`custom-radio-${label}`}
                onClick={handleCheckChange}
                className={`user-profile__notice-tag ${isChecked ? 'tagIsChecked' : ''}`}
            >
                {label}
            </label>
        </div>
    );
}
