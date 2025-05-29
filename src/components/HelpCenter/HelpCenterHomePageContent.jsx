import { Link } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';
import sn_small from '../../assets/sn_long.png';
import { screenUtils } from '../../lib/utils/screenUtils.js';
import { HelpCenterArrs } from './HelpCenterArrs.jsx';
import './HelpCenter.css';

const HelpCenterHomePageContent = () => {

    const { isExtraSmallScreen, isSmallScreen } = screenUtils();

    const { helpCenterHeaders } = HelpCenterArrs();

    return (
        <>
            <section
                className='help-center__welcome-msg mt-4 mt-sm-5 mt-lg-0 mb-3 mb-sm-4 mb-md-5'
                aria-labelledby='help-center-welcome'
            >
                <h2 id='help-center-welcome' className='help-center__h2 mb-0'>
                    Hello,
                </h2>

                <h3 className='help-center__h3 text-break'>
                    You have arrived at
                    <Image
                        src={sn_small}
                        alt='ShortNotice logo'
                        width={!isExtraSmallScreen && !isSmallScreen ? 218 : 137}
                        className='ms-1 ms-sm-2 help-center__img'
                        fluid
                    />
                    's help center.
                </h3>

                <h3 className='help-center__h3'>
                    Here, you will find the answers to your questions.
                </h3>
            </section>

            <Row
                as='section'
                xs={1}
                sm={3}
                className='h-100'
                aria-labelledby='help-center-navigation'
            >
                <h4 id='help-center-navigation' className='visually-hidden'>
                    Help center navigation options
                </h4>

                {helpCenterHeaders.map((header, idx) => (
                    <Col
                        key={idx}
                        className='help-center__header-col d-flex flex-column'
                        role='listitem'
                    >
                        <Link
                            to={`../help-center/${header.path}`}
                            className='help-center__header-a help-center__header-inner-div d-flex flex-column flex-grow-1 justify-content-evenly px-3 py-3 text-center'
                            aria-label={`Read more about ${header.title}`}
                        >
                            <h4 className='help-center__header-title mb-3'>
                                {header.title}
                            </h4>
                            <p className='mb-0'>{header.description}</p>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>

    )
}

export default HelpCenterHomePageContent