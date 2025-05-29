import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
    return (
        <div className="about__body mt-5 mt-xl-0">
            <main className="flex-grow-1" aria-labelledby="about-heading">
                <Container>
                    <h1 id="about-heading" className="visually-hidden">About ShortNotice</h1>

                    <section aria-labelledby="intro-heading" className="mb-4">
                        <h2 id="intro-heading">Welcome to ShortNotice</h2>
                        <p>
                            ShortNotice is the dynamic platform where fleeting yet impactful interactions take center stage. Express your thoughts, share updates, and connect meaningfully in real time—all through text (and GIFs). With each post automatically deleting after a set time, we embrace impermanence to keep the feed fresh and focused.
                        </p>
                        <p>
                            Free from the noise of endless scrolling, ShortNotice prioritizes words and ideas, creating a clean, distraction-free environment.
                        </p>
                    </section>

                    <section aria-labelledby="values-heading" className="mb-4">
                        <h2 id="values-heading">Why ShortNotice?</h2>
                        <p>
                            We encourage thoughtful sharing and reactions without drawn-out threads or debates—keeping things concise, focused, and impactful.
                        </p>
                    </section>

                    <section aria-labelledby="accounts-heading" className="mb-4">
                        <h2 id="accounts-heading">Account Types</h2>
                        <p>ShortNotice provides tailored spaces for:</p>
                        <ul className="list-unstyled">
                            <li>
                                <strong>Personal accounts:</strong> Share updates and get feedback or reactions—moments of connection without long dialogues.
                            </li>
                            <li>
                                <strong>Business accounts:</strong> Share timely promotions or announcements. Messages from these accounts begin with "Ad:".
                            </li>
                            <li>
                                <strong>Organizational accounts:</strong> Private updates for group communication—ideal for teachers, managers, or team leaders.
                            </li>
                        </ul>
                    </section>

                    <section aria-labelledby="mission-heading" className="mb-4">
                        <h2 id="mission-heading">Our Mission</h2>
                        <p>
                            We value simplicity, clarity, and purpose. By removing permanence and endless threads, we create space for authentic, meaningful moments.
                        </p>
                        <p>
                            Whether building a following, managing a brand, or streamlining updates, ShortNotice helps you connect in the moments that matter—before they're gone.
                        </p>
                    </section>

                    <section aria-labelledby="call-heading">
                        <h2 id="call-heading">Join Us</h2>
                        <p>
                            Experience the simplicity of ShortNotice—where every interaction begins and ends with purpose.
                        </p>
                    </section>
                </Container>
            </main>
        </div>

    )
}

export default About