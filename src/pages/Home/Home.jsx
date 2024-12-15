import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Stack, Button } from 'react-bootstrap';
import { GoogleLoginForm } from '../../components/LoginForm/Google/GoogleLoginForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { MdOutlinePassword } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import './Home.css';

const Home = ({ onSuccess }) => {

    const [timeLeft, setTimeLeft] = useState(10);
    const [isWaiting, setIsWaiting] = useState(false);
    const [sampleNotice, setSampleNotice] = useState('I\'ve had a bust day 😪. Time to watch some tv 📺.');

    const features = [
        {
            title: 'Ephemeral Posting: ',
            description: 'Choose how long your text posts stay live—12, 24, or 48 hours.',
            icon: '⌚'
        },
        {
            title: 'No Noise, Just Words: ',
            description: 'No photos, videos, or distractions—just authentic thoughts. Maybe GIFs in the near future 😜.',
            icon: '💭'
        },
        {
            title: 'Edit your notices: ',
            description: "Need to make changes? No problem. Edit your notices anytime before the timer runs out. It's your space, your rules.",
            icon: '📝'
        },
        {
            title: ' Delete your notices: ',
            description: 'Don\'t like what you posted? No problem. Delete your notices even if the timer has not run out.',
            icon: <i className="bi bi-trash3"></i>
        },
        {
            title: 'Secure Access for Teams and Groups: ',
            description: 'Leaders set passcodes to control who can view posts, ensuring secure and targeted communication.',
            icon: '🔒'
        }
    ];

    const steps = [
        {
            title: "Sign Up",
            description: "Create an account in seconds."
        },
        {
            title: "Post Your Thought",
            description: "Type what's on your mind and set a timer."
        },
        {
            title: "Edit or Delete",
            description: "Adjust or remove your post while it's live."
        },
        {
            title: "Let It Fade",
            description: "Once the timer ends, it's gone forever."
        }
    ];

    const organizationPerks = [
        {
            title: 'Private Posting:',
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
            description: "Posts vanish after the timer ends, requiring no cleanup.",
            icon: '⌚'
        }
    ];

    const organizationExamples = [
        {
            title: "For Instructors:",
            description: "Create a private space for your class to access important updates, assignments, or reminders—protected by a passcode.",
            icon: "👩‍🏫",
        },
        {
            title: "For Teams:",
            description: "Keep internal updates secure by requiring team members to enter a passcode to view posts.*",
            subtext: "*The posts made by the team leaders will also appear in the team members' personal feed.",
            icon: <RiTeamFill size={43} />,
        },
    ];


    const faq = [
        {
            question: "Can I edit or delete my posts?",
            answer: "Absolutely! You can edit or delete your posts anytime before they disappear. It's all about giving you control over what you share."
        },
        {
            question: "Who can use passcodes to secure posts?",
            answer: "Passcodes are designed for groups and teams like schools or small businesses to control access to their posts. Notices posted behind the passcodes are not meant for public consumption."
        }
    ];

    useEffect(() => {
        let timer;

        if (!isWaiting) {
            if (timeLeft > 0) {
                timer = setInterval(() => {
                    setTimeLeft((prevTime) => prevTime - 1);
                }, 1000);
            } else {
                setIsWaiting(true);
                setSampleNotice('');
                setTimeout(() => {
                    setTimeLeft(10);
                    setIsWaiting(false);
                    setSampleNotice('\"I\'ve had a bust day 😪. Time to watch some tv 📺.\"');
                }, 3000);
            }
        }

        return () => clearInterval(timer);
    }, [timeLeft, isWaiting]);

    const formatTime = (seconds) => {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    return (
        <div className='home__body d-flex flex-column min-vh-100'>
            <Header>
                <GoogleLoginForm
                    onSuccess={onSuccess}
                />
            </Header>
            <main className='flex-grow-1 '>
                <Container>
                    {/* HERO */}
                    <Row>
                        <Col>
                            <h2>HERO</h2>
                            <h2>Share updates and ideas in the moment. No distractions. No maintenance."</h2>
                            <p>
                                {/* {sampleNotice} */}
                                {/* {formatTime(timeLeft)} */}

                            </p>
                            <p>{'[A text + timer. When the timer runs out, the text fades away. Wait 3 seconds. Reset.]'}</p>
                            <p>Join with your Google account<Button>Login
                            </Button>
                                <sub>More options coming soon!</sub>
                            </p>
                        </Col>
                    </Row>

                    {/* FEATURES */}
                    <Row as='ul' className='home__body-features-row list-unstyled'>
                        <h2>FEATURES</h2>
                        <br />
                        {features.map((feature, idx) => {
                            return (
                                <Col as='li' key={idx}
                                    xs={12} lg={6} xl={4}
                                    className='home__body-features-col d-flex align-items-stretch'
                                >
                                    <div className='px-3 py-2 home__body-features-col-div d-flex flex-column justify-content-between h-100'>
                                        <div>
                                            <strong>{feature.title}</strong>
                                            {feature.description}
                                        </div>
                                        <div style={{ fontSize: '24pt' }} className='text-center my-3'>{feature.icon}</div>
                                    </div>

                                </Col>
                            )
                        })}
                    </Row>
                    {/* Organization */}
                    {/* Organization Intro */}
                    <Row className='home__body-organization-row-into'>
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
                                    xs={12} lg={6} xl={4}
                                    className='home__body-organization-perks-col d-flex align-items-stretch'>
                                    <div className='home__body-organization-perks-col-div px-3 py-2 d-flex flex-column justify-content-between h-100'>
                                        <div>
                                            <strong>{perk.title} </strong>{perk.description}
                                        </div>
                                        <div style={{ fontSize: '24pt' }} className='text-center my-3'>{perk.icon}</div>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    {/* Organization Example */}
                    {/* <Row as='ul' className='home__body-organization-examples-row list-unstyled'>
                        <Col as='li' xs={12} md={6} className='home__body-organization-example-col d-flex align-items-stretch'>
                            <div className='home__body-organization-example-col-div px-3 py-2 d-flex flex-column justify-content-between h-100'>
                                <div>
                                    <strong>For Intructors: </strong>
                                    <span>Create a private space for your class to access important updates, assignments, or reminders—protected by a passcode.</span>
                                </div>
                                <div style={{ fontSize: '24pt' }} className='text-center my-3'>
                                    👩‍🏫
                                </div>
                            </div>
                        </Col>
                        <Col as='li' xs={12} md={6} className='home__body-organization-example-col d-flex align-items-stretch'>
                            <div className='home__body-organization-example-col-div px-3 py-2 d-flex flex-column justify-content-between h-100'>
                                <div>
                                    <strong>For Teams: </strong>
                                    <span>Keep internal updates secure by requiring team members to enter a passcode to view posts.*</span>
                                    <br />
                                    <sub>*The posts made by the team leaders will also appear in the team members' personal feed.</sub>
                                </div>
                                <div className='text-center my-3'>
                                    <RiTeamFill size={43} />
                                </div>
                            </div>
                        </Col>
                    </Row> */}

                    <Row as="ul" className="home__body-organization-examples-row list-unstyled">
                        {organizationExamples.map((example, idx) => (
                            <Col
                                key={idx}
                                as="li"
                                xs={12} md={6}
                                className="home__body-organization-example-col d-flex align-items-stretch"
                            >
                                <div className="home__body-organization-example-col-div px-3 py-2 d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <strong>{example.title}</strong>
                                        <span>{example.description}</span>
                                        {example.subtext && <sub><br />{example.subtext}</sub>}
                                    </div>
                                    <div style={{ fontSize: '24pt' }} className="text-center my-3">
                                        {example.icon}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>


                    {/* HOW IT WORKS */}
                    {/* <Row>
                        <Col>
                            <h2>HOW IT WORKS</h2>
                            <h4>Step by step</h4>
                            <ol>
                                {steps.map((step, idx) => {
                                    return (
                                        <li key={idx}>
                                            <strong>{step.title} </strong>{step.description}
                                        </li>
                                    )
                                })}
                            </ol>
                        </Col>
                    </Row> */}

                    {/* FAQ */}
                    {/* <Row>
                        <Col>
                            <h2>FAQ</h2>
                            {faq.map((question, idx) => {
                                return (
                                    <p key={idx}>
                                        <strong>{question.question}</strong><br />
                                        {question.answer}
                                    </p>
                                )
                            })}
                        </Col>
                    </Row> */}

                </Container>
            </main>
            <Footer />
        </div>
    )
}

export default Home