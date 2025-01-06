import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GoogleLoginForm } from '../../../components/LoginForm/Google/GoogleLoginForm';
// import Header from '../../components/PreLogin/Header/Header';
// import Footer from '../../components/PreLogin/Footer/Footer';
import { Hero } from '../../../components/PreLogin/Home/Hero';
import { CallToAction } from '../../../components/PreLogin/Home/CallToAction';
import { MdOutlinePassword } from "react-icons/md";
import { BsReply } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { RiNumber1, RiNumber2, RiNumber3, RiNumber4 } from "react-icons/ri";
import { screenUtils } from '../../../lib/utils/screenUtils';

const Home = ({ onSuccess }) => {

    const { isSmallScreen } = screenUtils();

    const features = [
        {
            title: 'Ephemeral Posting: ',
            description: 'Choose how long your notices stay live—12, 24, or 48 hours.',
            icon: '⌚'
        },
        {
            title: 'No Noise, Just Words: ',
            description: 'No photos, videos, or distractions—just authentic thoughts. Maybe GIFs in the near future 😜.',
            icon: '💭'
        },
        {
            title: 'Edit your notices: ',
            description: 'Need to make changes? No problem. Edit your notices anytime before the timer runs out. It\'s your space, your rules.',
            icon: '📝'
        },
        {
            title: 'Interact with others\' notices: ',
            description: 'Like, save, and react to others\' notices.',
            icon: (
                <span>
                    <FaHeart color='red' size={!isSmallScreen ? 28 : 17.5} /> {' '}
                    <AiOutlineSave size={!isSmallScreen ? 30 : 18.75} /> {' '}
                    <BsReply size={!isSmallScreen ? 38 : 23.75} />

                </span>
            ),
        },
        {
            title: ' Delete your notices: ',
            description: 'Don\'t like what you posted? No problem. Delete your notice even if the timer has not run out.',
            icon: <i className="bi bi-trash3"></i>
        },
        {
            title: 'Secure Access for Teams and Groups: ',
            description: 'Leaders set passcodes to control who can view notices, ensuring secure and targeted communication.',
            icon: '🔒'
        }
    ];

    const organizationPerks = [
        {
            title: 'Private:',
            description: "Protect updates with passcodes for exclusive access.",
            icon: <MdOutlinePassword />
        },
        {
            title: 'Effortless Setup:',
            description: "Leaders create passcodes; team members enter the code.",
            icon: '✅'
        },
        {
            title: 'Ephemeral by Design:',
            description: "Notices vanish after the timer ends, requiring no cleanup.",
            icon: '⌚'
        }
    ];

    const organizationExamples = [
        {
            title: 'For Teams: ',
            description: 'Keep internal updates secure by requiring team members to enter a passcode to view notices.',
            subtext: '*The notices by the team leaders will also appear in the team members\' personal feed.',
            icon: <RiTeamFill size={!isSmallScreen ? 43 : 26.88} />,
        },
        {
            title: 'For Instructors: ',
            description: 'Create a private space for your class to access important updates, assignments, or reminders—protected by a passcode.',
            icon: '👩‍🏫',
        }
    ];

    const steps = [
        {
            title: 'Sign Up: ',
            description: 'Create an account in seconds.',
            icon: <RiNumber1 size={40} />
        },
        {
            title: 'Post Your Thought: ',
            description: 'Type what\'s on your mind and set a timer.',
            icon: <RiNumber2 size={40} />
        },
        {
            title: 'Edit or Delete: ',
            description: 'Adjust or remove your notice while it\'s live.',
            icon: <RiNumber3 size={40} />
        },
        {
            title: 'Let It Fade: ',
            description: 'Once the timer ends, it\'s gone forever.',
            icon: <RiNumber4 size={40} />
        }
    ];

    const faq = [
        {
            question: 'How much does it cost?',
            answer: (
                <span><strong>ShortNotice is available free of charge.</strong> SN Plus will be launched in the near future, offering all the functionalities of ShortNotice along with exciting new features. SN Plus will require interested users to pay either a monthly or one-time fee.
                </span>
            )
        },
        {
            question: 'What sets apart ShortNotice from other similar platforms? Why choose ShortNotice?',
            answer: 'At ShortNotice, the users will not encounter a cluttered environment. The goal of the platform is to be an addition to the user\'s daily life and business, and not a distraction. That is why the platform values '
        },
        {
            question: 'Can I edit or delete my posts?',
            answer: 'Absolutely! You can edit or delete your posts anytime before they disappear. It\'s all about giving you control over what you share.'
        },
        {
            question: 'Who can use passcodes to secure posts?',
            answer: 'Passcodes are designed for groups and teams like schools, employess of businesses, or organizations to control access to their posts. Notices posted by team leaders are not meant for public consumption.'
        },
        {
            question: 'Can I interact with other accounts?',
            answer: 'Yes. You can follow the accounts you find interesting. Their notices will appear in your personal feed.'
        }
    ];

    return (
        <div className='home__body d-flex flex-column min-vh-100'>
            <main className='flex-grow-1'>
                <Container className='home__body-container'>

                    {/* HERO */}
                    <Row className='home__body-hero-row'>
                        <Col className='home__body-hero-col d-flex align-items-stretch'>
                            <div className='home__body-hero-col-div px-4 py-5 d-flex flex-column align-items-stretch h-100'>
                                <div className=' py-5'>
                                    <h2 className='text-center pt-4'>Share updates and ideas in the moment. No distractions. No maintenance. Always current.</h2>
                                </div>
                                <Hero />
                                <div className='d-flex flex-column flex-sm-row align-items-center justify-content-evenly pt-3'>
                                    <h4 className='mb-0 pe-0 pe-sm-2'>Join with your Google account</h4>

                                    <span className='mt-3 mt-sm-0'>
                                        <GoogleLoginForm onSuccess={onSuccess}
                                            subtitle={'More sign in options coming soon!'}
                                        />
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* CTA */}
                    {/* <CallToAction sectionName={'hero'}>
                        <GoogleLoginForm onSuccess={onSuccess} />
                    </CallToAction> */}

                    {/* FEATURES */}
                    <div>
                        <Row as='ul' className='home__body-features-row list-unstyled'>
                            <h2>FEATURES</h2>
                            {features.map((feature, idx) => {
                                return (
                                    <Col as='li' key={idx}
                                        xs={12} md={6} xl={4}
                                        className='home__body-features-col d-flex align-items-stretch'
                                    >
                                        <div className='px-3 py-2 home__body-features-col-div d-flex flex-column justify-content-between h-100'>
                                            <div className='mt-3'>
                                                <p className='mb-0'>
                                                    <strong>{feature.title}</strong>
                                                    {feature.description}
                                                </p>
                                            </div>
                                            <div style={{ fontSize: !isSmallScreen ? '24pt' : '15pt' }} className='text-center my-3'>{feature.icon}</div>
                                        </div>

                                    </Col>
                                )
                            })}
                        </Row>

                        {/* Organization */}
                        {/* Organization Intro */}
                        <Row className='home__body-organization-row-into mt-5'>
                            <Col >
                                <h4 className='text-center d-flex align-items-center justify-content-center'>
                                    <i className='bi bi-diagram-3-fill home__body-organization-row-intro-icon me-2'></i>
                                    Designed to streamline communication from higherups to team members.
                                </h4>
                                <p className='text-center fw-bold'>Empower your organization with secure and controlled communication. Use passcodes to ensure only authorized members see posts. Perfect for teachers sharing with students or managers updating their teams.</p>
                            </Col>

                        </Row>

                        {/* Organization Perks */}
                        <Row as='ul' className='home__body-organization-perks-row list-unstyled'>
                            {organizationPerks.map((perk, idx) => {
                                return (
                                    <Col as='li' key={idx}
                                        xs={12} md={6} xl={4}
                                        className='home__body-organization-perks-col d-flex align-items-stretch'>
                                        <div className='home__body-organization-perks-col-div px-3 py-2 d-flex flex-column justify-content-between h-100'>
                                            <div className='mt-3'>
                                                <p className='mb-0'>
                                                    <strong>{perk.title} </strong>{perk.description}
                                                </p>
                                            </div>
                                            <div style={{ fontSize: !isSmallScreen ? '24pt' : '15pt' }} className='text-center my-3'>{perk.icon}</div>
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>

                        {/* Organization Example */}
                        <Row as="ul" className="home__body-organization-examples-row list-unstyled">
                            {organizationExamples.map((example, idx) => (
                                <Col
                                    key={idx}
                                    as="li"
                                    xs={12} md={6}
                                    className="home__body-organization-example-col d-flex align-items-stretch"
                                >
                                    <div className='home__body-organization-example-col-div px-3 py-2 d-flex flex-column justify-content-between h-100'>
                                        <div className='mt-3'>
                                            <p className='mb-0'>
                                                <strong>{example.title}</strong>
                                                <span>{example.description}</span>
                                                {example.subtext && <sub><br />{example.subtext}</sub>}
                                            </p>
                                        </div>
                                        <div style={{ fontSize: !isSmallScreen ? '24pt' : '15pt' }} className='text-center my-3'>
                                            {example.icon}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* CTA */}
                    <CallToAction sectionName={'features'}>
                        <GoogleLoginForm onSuccess={onSuccess} />
                    </CallToAction>

                    {/* HOW IT WORKS */}
                    <div>
                        <Row as='ol' className='home__body-how-row list-unstyled mb-0'>
                            <h2>HOW IT WORKS</h2>
                            {steps.map((step, idx) => {
                                return (
                                    <Col as='li' key={idx}
                                        xs={6} md={3}
                                        className='home__body-how-col d-flex align-items-stretch'>
                                        <div className='home__body-how-col-div px-3 py-2 d-flex flex-column justify-content-between h-100'>
                                            <div className='text-center mt-3'>
                                                {step.icon}
                                            </div>
                                            <div className='my-3'>
                                                <p className='mb-0'>
                                                    <strong>{step.title} </strong>{step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })}
                        </Row>
                    </div>

                    {/* CTA */}
                    <CallToAction sectionName={'how'}>
                        <GoogleLoginForm onSuccess={onSuccess} />
                    </CallToAction>

                    {/* FAQ */}
                    <div>
                        <Row as='section' aria-labelledby='faq-title' className='faq-section'>
                            <Col xs={12}>
                                <h2 id='faq-title' className={!isSmallScreen ? 'mb-4' : 'mb-2'}>Frequently Asked Questions</h2>
                            </Col>
                            {faq.map((item, index) => (
                                <Col as='details' xs={12} key={index} className='mb-3'>

                                    <summary className='fw-bold'>
                                        {item.question}
                                    </summary>
                                    <p className='mt-2'>{item.answer}</p>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default Home