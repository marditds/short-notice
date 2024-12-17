import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const CallToAction = ({ sectionName, children }) => {


    // const joinNowTexts = [
    //     'Ready to get started? Join now!',
    //     'Don\'t miss out—become a part of our community today!',
    //     'Take the first step toward simplifying your life. Join now!',
    //     'Your next big opportunity is just one click away.',
    //     'Join today and unlock all the possibilities!',
    //     'It\'s free, fast, and full of potential. Join now!',
    //     'Why wait? Start your journey with us today!',
    //     'Exclusive features are just a click away—sign up now!',
    //     'Join now and take control of your world!',
    //     'Your future self will thank you. Join today!',
    //     'Discover what you\'ve been missing—join us now!'
    // ];

    const joinNowTexts = {
        hero: 'Ready to get started? Join now!',
        features: 'Unlock all the possibilities—no cost, no catch. Join now!',
        how: 'Simple steps, incredible outcomes. Start now!'
    };

    return (
        <Row>
            <Col className='cta-col'>
                <div className='cta-col-div px-3 px-sm-5 py-4 py-sm-5 d-sm-flex justify-content-evenly align-items-center '>
                    <div>
                        <h2>{joinNowTexts[sectionName] || 'Join now and discover more!'}</h2>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </Col>
        </Row>
    );
};
