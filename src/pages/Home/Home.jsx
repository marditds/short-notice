import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { GoogleLoginForm } from '../../components/LoginForm/Google/GoogleLoginForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = ({ onSuccess }) => {

    const [timeLeft, setTimeLeft] = useState(10);
    const [isWaiting, setIsWaiting] = useState(false);
    const [sampleNotice, setSampleNotice] = useState('I\'ve had a bust day 😪. Time to watch some tv 📺.');

    const features = [
        {
            // title: (
            //     <span>
            //         <i className="bi bi-stopwatch"></i>
            //         {' Ephemeral Posting'}
            //     </span>
            // ),
            title: "⌚ Ephemeral Posting: ",
            description: "Choose how long your text posts stay live—12, 24, or 48 hours."
        },
        {
            title: "💭 No Noise, Just Words: ",
            description: "No photos, videos, or distractions—just authentic thoughts. Maybe GIFs in the near future 😜."
        },
        {
            // title: (
            //     <span>
            //         <i className="bi bi-pencil"></i>
            //         {' Edit your notices'}
            //     </span>
            // ),
            title: "📝 Edit your notices: ",
            description: "Need to make changes? No problem. Edit your notices anytime before the timer runs out. It's your space, your rules."
        },
        {
            title: (
                <span>
                    <i className="bi bi-trash3"></i>
                    {' Delete your notices: '}
                </span>
            ),
            description: "Don't like what you posted? No problem. Delete your notices even if the timer has not run out."
        },
        {
            title: "🔒 Secure Access for Teams and Groups: ",
            description: "Leaders set passcodes to control who can view posts, ensuring secure and targeted communication."
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
            title: "😎 Private Posting:",
            description: "Protect updates with passcodes for exclusive access."
        },
        {
            title: "✅ Effortless Setup:",
            description: "Leaders create passcodes; team members enter the code."
        },
        {
            title: "⌚ Ephemeral by Design:",
            description: "Posts vanish after the timer ends, requiring no cleanup."
        }
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
                    {/* <Row> */}
                    {/* <Col> */}
                    {/* <h4>Overview of the product</h4> */}
                    <Row as='ul' className='d-flex row-gap-3 list-unstyled'>
                        <h2>FEATURES</h2>
                        <br />
                        {features.map((feature, idx) => {
                            return (
                                <Col as='li' key={idx}
                                    xs={12} lg={6} xl={4}
                                >
                                    <strong>{feature.title} </strong>{feature.description}
                                </Col>
                            )
                        })}
                    </Row>
                    {/* </Col> */}
                    {/* </Row> */}
                    {/* Organization */}
                    <Row>
                        <Col>
                            <h4>
                                Designed for streamlining communication from higherups to team members.
                            </h4>
                            <p>Empower your organization with secure and controlled communication. Use passcodes to ensure only authorized members see posts. Perfect for teachers sharing with students or managers updating their teams.</p>
                            <ul className='list-unstyled'>
                                {organizationPerks.map((perk, idx) => {
                                    return (
                                        <li key={idx}>
                                            <strong>{perk.title} </strong>{perk.description}
                                        </li>
                                    )
                                })}
                            </ul>
                            <p>
                                <strong>👩‍🏫 For Intructors:</strong>
                                <span>Create a private space for your class to access important updates, assignments, or reminders—protected by a passcode.</span>
                                <br />
                                <strong><i className="bi bi-diagram-3-fill"></i> For Teams:</strong>
                                <span>Keep internal updates secure by requiring team members to enter a passcode to view posts.</span>
                                <sub>Team members will see the posts made by their team leaders in their personal feed. </sub>
                            </p>
                        </Col>
                    </Row>
                    {/* HOW IT WORKS */}
                    <Row>
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
                    </Row>
                    {/* FAQ */}
                    <Row>
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
                    </Row>
                </Container>
            </main>
            <Footer />
        </div>
    )
}

export default Home