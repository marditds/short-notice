import React from 'react';
import { Container } from 'react-bootstrap';
import { GoogleLoginForm } from '../../components/LoginForm/Google/GoogleLoginForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = ({ onSuccess }) => {

    return (
        <div className='home__body d-flex flex-column min-vh-100'>
            <Header />
            <main className='flex-grow-1 '>
                <Container>
                    <GoogleLoginForm
                        onSuccess={onSuccess}
                    />
                </Container>
            </main>
            <Footer />
        </div>
    )
}

export default Home