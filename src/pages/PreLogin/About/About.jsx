import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
    return (
        <div className='about__body mt-5 mt-xl-0'>
            <main className='flex-grow-1'>
                <Container>
                    <p>
                        Welcome to ShortNotice, the dynamic platform where fleeting yet impactful interactions take center stage. ShortNotice empowers users to express their thoughts, share updates, and connect meaningfully in real time—all through text (and GIFs). With every post automatically deleting after a user-selected time limit, we embrace the beauty of impermanence, keeping the feed fresh and focused. Free from the noise of endless scrolling, ShortNotice prioritizes words and ideas, creating a clean, distraction-free environment.
                    </p>

                    <p>
                        At ShortNotice, we encourage thoughtful sharing and reactions without devolving into ongoing threads or debates, keeping interactions concise, focused, and impactful.
                    </p>

                    <p>
                        Whether you're an individual, a business, or part of a larger organization, ShortNotice provides tailored spaces for you:
                    </p>

                    <ul className='list-unstyled'>
                        <li>
                            <strong>Personal accounts</strong> enable users to share their updates and receive feedback or reactions, fostering moments of connection without prolonged dialogue.
                        </li>
                        <li>
                            <strong>Business accounts</strong> allow brands to share timely promotions, announcements, or messages, inviting reactions or questions from their audience. Notices shared by business accounts are preceded by 'Ad:'.
                        </li>
                        <li>
                            <strong>Organizational accounts</strong> provide a private space for leaders, teachers, or managers to share updates and announcements exclusively with their group, ensuring streamlined communication in a secure format.
                        </li>
                    </ul>

                    <p>
                        At ShortNotice, we value simplicity, clarity, and purpose-driven communication. By stripping away permanence and focusing on concise exchanges, we foster an environment that encourages authentic, meaningful interactions without the noise of endless discussions. Whether you are building an audience, managing a brand, or streamlining group updates, ShortNotice helps you connect in the moments that matter—before they're gone.
                    </p>

                    <p>
                        Join us and experience the simplicity of ShortNotice: where every interaction begins and ends with purpose.
                    </p>

                </Container>
            </main>
        </div>
    )
}

export default About