import React from 'react';
import PrivacyData from './PrivacyData';
import { Container, ListGroup } from 'react-bootstrap';

const Privacy = () => {

    const { privacyPolicyData } = PrivacyData();

    return (
        <Container>
            <ListGroup as={'ul'} className='privacyPolicy__list-group'>
                <h3 className='ps-0 ps-sm-3'>Privacy Policy</h3>
                {
                    privacyPolicyData.map((privacyPolicy, idx) => {
                        return (
                            <ListGroup.Item as={'li'} key={idx} className='privacyPolicy__list-group-item my-1'>
                                <h5 className='mb-1'>{privacyPolicy.title}</h5>
                                {privacyPolicy.description}
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
        </Container>
    )
}

export default Privacy;