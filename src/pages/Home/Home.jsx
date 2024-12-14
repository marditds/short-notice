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
                            <h4>Tagline</h4>
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
                                <li>Ephemeral Posting: Your text posts disappear after 12, 24, or 48 hours.</li>
                                <li>No Noise, Just Words: No photos, videos, or distractions—just authentic thoughts.</li>
                                <li>Customize the Clock: Choose how long your post stays live.</li>
                                <li>Real Conversations: Connect without the pressure of permanence.</li>
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
                                <li>Sign Up - Create an account in seconds.</li>
                                <li>Post Your Thought - Type what's on your mind and set a timer.</li>
                                <li>Engage - Start conversations before your post disappears.</li>
                            </ol>
                        </Col>
                    </Row>
                </Container>
            </main>
            <Footer />
        </div>
    )
}

export default Home