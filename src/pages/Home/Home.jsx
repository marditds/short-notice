import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GoogleLoginForm } from '../../components/LoginForm/Google/GoogleLoginForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = ({ onSuccess }) => {

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
                            {/* <h1>Simplified communitcation</h1>
                            <h2>Last minute announcements</h2>
                            <h3>No distraction</h3>
                            <h4>Easy maintenance</h4>
                            <h5 style={{ textTransform: "none" }}>Strightforward</h5> */}
                        </Col>
                        <Col>
                            <h4>Share updates and ideas in the moment. No distractions. No maintenance.</h4>
                            <h4>Grphic</h4>
                            <h4>Login btn</h4>
                        </Col>
                    </Row>
                    {/* FEATURE */}
                    <Row>
                        <Col>
                            <h2>FEATURE</h2>
                        </Col>
                        <Col>
                            <h4>Overview of the product</h4>
                            <ol>
                                <li>
                                    <strong>Ephemeral Posting:</strong>
                                    Your text posts disappear after 12, 24, or 48 hours.</li>
                                <li>
                                    <strong>No Noise, Just Words:</strong>
                                    No photos, videos, or distractions—just authentic thoughts.</li>
                                <li>
                                    <strong>Customize the Clock:</strong>
                                    Choose how long your post stays live.</li>
                                <li>
                                    <strong>Real Conversations:</strong>
                                    Connect without the pressure of permanence.</li>
                                <li>
                                    <strong>Full Control Over Your Posts:
                                    </strong>
                                    Need to make changes? No problem. Edit or delete your posts anytime before the timer runs out. It's your space, your rules.
                                </li>
                            </ol>
                        </Col>
                    </Row>
                    {/* HOW IT WORKS */}
                    <Row>
                        <Col>
                            <h2>HOW IT WORKS</h2>
                        </Col>
                        <Col>
                            <h4>Step by step</h4>
                            <ol>
                                <li><strong>Sign Up:</strong> Create an account in seconds.</li>
                                <li><strong>Post Your Thought</strong> Type what's on your mind and set a timer.</li>
                                <li><strong>Edit or Delete Anytime:</strong> Adjust or remove your post while it's live.</li>
                                <li><strong>Let It Fade:</strong> Once the timer ends, it's gone forever.</li>
                            </ol>
                        </Col>
                    </Row>
                    {/* FAQ */}
                    <Row>
                        <Col>
                            <h2>FAQ</h2>
                        </Col>
                        <Col>
                            <strong>Q:</strong> Can I edit or delete my posts?
                            <strong>A:</strong> Absolutely! You can edit or delete your posts anytime before they disappear. It's all about giving you control over what you share."
                        </Col>
                    </Row>
                </Container>
            </main>
            <Footer />
        </div>
    )
}

export default Home