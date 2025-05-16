import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { GoogleLoginForm } from '../../../components/LoginForm/Google/GoogleLoginForm';
import { Hero } from '../../../components/PreLogin/Home/Hero';
import { CallToAction } from '../../../components/PreLogin/Home/CallToAction';
import { MdOutlinePassword } from "react-icons/md";
import { BsReply } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { BsHandThumbsUp } from "react-icons/bs";
import { BsFloppy } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { RiNumber1, RiNumber2, RiNumber3, RiNumber4 } from "react-icons/ri";
import { screenUtils } from '../../../lib/utils/screenUtils';


const Home = () => {

    const { isExtraSmallScreen, isSmallScreen } = screenUtils();

    const features = [
        {
            title: 'Ephemeral posting: ',
            description: 'Pick how long your notices stay up—anywhere from 1 day to a full week.',
            icon: '⌚'
        },
        {
            title: 'No noise, just words (and GIFs 😜): ',
            description: 'No photos, videos, or distractions—just authentic thoughts.',
            icon: '💭'
        },
        {
            title: 'Edit your notices: ',
            description: 'Need to make changes? No problem. Edit your notices anytime before the timer runs out. It\'s your space, your rules.',
            icon: <BsPencil size={!isExtraSmallScreen && !isSmallScreen ? 28 : 17.5} />
        },
        {
            title: 'Interact with others\' notices: ',
            description: 'Like, save, and react to others\' notices.',
            icon: (
                <span>
                    <BsHandThumbsUp size={!isExtraSmallScreen && !isSmallScreen ? 28 : 17.5} /> {' '}
                    <BsFloppy size={!isExtraSmallScreen && !isSmallScreen ? 30 : 18.75} /> {' '}
                    <BsReply size={!isExtraSmallScreen && !isSmallScreen ? 38 : 23.75} />
                </span>
            ),
        },
        {
            title: 'AI generated templates: ',
            description: 'Get a head start with AI-powered templates! Click a button, and AI will generate a structured starting point to help you organize your thoughts effortlessly.',
            icon: <i className='bi bi-stars' />
        },
        {
            title: 'Delete your notices: ',
            description: 'Don\'t like what you posted? No problem. Delete your notice even if the timer has not run out.',
            icon: <i className='bi bi-trash3' />
        },
        {
            title: 'Private access for groups: ',
            description: 'Leaders set passcodes to control who can view notices, ensuring private and targeted communication.',
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
            description: "Leaders create passcodes; group members enter the code.",
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
            title: 'For Groups: ',
            description: 'Keep internal updates secure by requiring group members to enter a passcode to view notices.',
            subtext: '*The notices by the group leaders will also appear in the group members\' personal feed.',
            icon: <RiTeamFill size={!isExtraSmallScreen && !isSmallScreen ? 43 : 26.88} />,
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
            answer: 'At ShortNotice, the users will not encounter a cluttered environment. The goal of the platform is to be an addition to the user\'s daily life and business, and not a distraction.'
        },
        {
            question: 'Can I edit or delete my posts?',
            answer: 'Absolutely! You can edit or delete your posts anytime before they disappear. It\'s all about giving you control over what you share.'
        },
        {
            question: 'Who can use passcodes to secure posts?',
            answer: 'Passcodes are designed for groups and teams like schools, employess of businesses, or organizations to control access to their posts. Notices posted by group leaders are not meant for public consumption.'
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
                            <div className='home__body-hero-col-div px-4 py-4 py-md-5 d-flex flex-column align-items-stretch h-100'>
                                <div className='py-0 py-md-5'>
                                    <h2 className='text-center mb-0 pb-4 pb-md-0 '>Share updates and ideas in the moment. No distractions. No maintenance. Always current.</h2>
                                </div>
                                <Hero />
                                <div className='d-flex flex-column flex-sm-row align-items-center justify-content-evenly pt-3'>
                                    <h4 className='mb-0 pe-0 pe-sm-2'>Create your account now!</h4>

                                    <span className='mt-2 mt-sm-0'>
                                        <GoogleLoginForm
                                            subtitle={<>Already have an account? <Link to='signin'>Sign in</Link>
                                            </>}
                                        />
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>

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
                                            <div className='mt-1 mt-md-3'>
                                                <p className='mb-0'>
                                                    <strong>{feature.title}</strong>
                                                    {feature.description}
                                                </p>
                                            </div>
                                            <div style={{ fontSize: !isExtraSmallScreen && !isSmallScreen ? '24pt' : '15pt' }} className='text-center my-2 my-md-3'>{feature.icon}</div>
                                        </div>

                                    </Col>
                                )
                            })}
                        </Row>

                        {/* Organization */}
                        {/* Organization Intro */}
                        <Row className='home__body-organization-row-into mt-5'>
                            <Col >
                                <h4 className='text-center d-flex align-items-start justify-content-center'>
                                    <i className='bi bi-diagram-3-fill home__body-organization-row-intro-icon me-0 me-lg-3' />
                                    Designed to streamline communication from higherups to group members.
                                </h4>
                                <p className='text-center fw-bold'>Empower your organization with secure and controlled communication. Use passcodes to ensure only authorized members see posts. Perfect for teachers sharing with students or managers updating their group members.</p>
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
                                            <div className='mt-1 mt-md-3'>
                                                <p className='mb-0'>
                                                    <strong>{perk.title} </strong>{perk.description}
                                                </p>
                                            </div>
                                            <div style={{ fontSize: !isExtraSmallScreen && !isSmallScreen ? '24pt' : '15pt' }} className='text-center my-2 my-md-3'>{perk.icon}</div>
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
                                        <div className='mt-1 mt-md-3'>
                                            <p className='mb-0'>
                                                <strong>{example.title}</strong>
                                                <span>{example.description}</span>
                                                {example.subtext && <sub><br />{example.subtext}</sub>}
                                            </p>
                                        </div>
                                        <div style={{ fontSize: !isExtraSmallScreen && !isSmallScreen ? '24pt' : '15pt' }} className='text-center my-2 my-md-3'>
                                            {example.icon}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* CTA */}
                    <CallToAction sectionName={'features'}>
                        <GoogleLoginForm subtitle={<>Already have an account? <Link to='signin'>Sign in</Link></>} />
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
                        <GoogleLoginForm subtitle={<>Already have an account? <Link to='signin'>Sign in</Link></>} />
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