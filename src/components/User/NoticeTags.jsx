import { useState } from "react";
import { Form } from 'react-bootstrap';


export const NoticeTags = ({ label, name }) => {

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckChange = () => {
        console.log(`${label} clicked.`);
        setIsChecked(preVal => !preVal);
    }

    const gray = 'transparent';
    const green = 'var(--main-accent-color)';

    return (
        <div>
            <Form.Check
                type='radio'
                checked={isChecked}
                onChange={() => { }}
                id={`custom-radio-${label}`}
                label={label}
                name={name}
                style={{ display: 'none' }}
            />
            <label
                htmlFor={`custom-radio-${label}`}
                onClick={handleCheckChange}
                style={{ cursor: 'pointer', backgroundColor: isChecked ? green : gray }}
                className={`user-profile__notice-tag ${isChecked ? 'tagIsChecked' : ''}`}
            >
                {label}
            </label>
        </div>
    );
}
