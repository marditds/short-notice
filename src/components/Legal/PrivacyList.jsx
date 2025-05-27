import PrivacyData from './PrivacyData';
import { ListGroup } from 'react-bootstrap';

const Privacy = () => {

    const { privacyPolicyData } = PrivacyData();

    return (
        <section aria-labelledby='privacy-policy-heading'>
            <h2 id='privacy-policy-heading' className='ps-0 ps-sm-3'>
                Privacy Policy
            </h2>
            <ListGroup as='ul' className='privacyPolicy__list-group'>
                {privacyPolicyData.map((privacyPolicy, idx) => (
                    <ListGroup.Item
                        as='li'
                        key={idx}
                        className='privacyPolicy__list-group-item my-1'
                    >
                        <h3 tabIndex={-1} className='mb-1 heading-h5-style'>
                            {privacyPolicy.title}
                        </h3>
                        {privacyPolicy.description}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </section>
    )
}

export default Privacy;