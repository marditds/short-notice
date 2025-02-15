import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import { useContactMessages } from '../../../lib/hooks/useContactMessages';

const Contact = () => {

    // const [messageEmail, setMessageEmail] = useState('');
    // const [messageText, setMessageText] = useState('');

    // const [messsageCharCount, setMessageCharCount] = useState(0);

    // const messageCharLimit = 1500;

    // const onMessageEmailChange = (e) => {
    //     let tempEmail = e.target.value;
    //     setMessageEmail(tempEmail);
    // }

    // const onMessageTextChange = (e) => {
    //     let tempMsg = e.target.value;
    //     setMessageText(tempMsg);
    //     setMessageCharCount(tempMsg.length)
    // }

    // const handleMessageSubmission = async () => {
    //     console.log('messageEmail', messageEmail);
    //     console.log('messageText', messageText);
    //     await useContactMessages(messageEmail, messageText)
    // }

    return (
        <Container>
            <h2 className='contact__title mb-0 mt-5 mt-lg-0'>Contact</h2>

            <p className='contact__text mb-1'>If you have any questions, concerns, or comments, please send a text message <i className='bi bi-chat-left-dots fs-5' /> to (818)690-0919.
            </p>

            <p className=' mb-1'>
                <strong>
                    Note: Calls to this number will not be answered.
                </strong>
            </p>
            <p> Thank you <span className='fs-5'>🙏</span> for your understanding and cooperation.
            </p>
            <p className='contact__text mb-1'>
                Alternatively, you can email ShortNotice at <i className='bi bi-envelope fs-5' /> to  <a href='mailto:shortnotice@altmails.com' className='contact__email-link'>shortnotice@altmails.com</a>.
            </p>

            {/* Contact form from formSubmit */}
            <div>
                {/* <form target="_blank" action="https://formsubmit.co/a3daa822221fc605163675b7ff5e2919" method="POST">
                <div className="form-group">
                    <div className="form-row">
                        <div className="col">
                            <input type="text" name="name" className="form-control" placeholder="Full Name" required />
                        </div>
                        <div className="col">
                            <input type="email" name="email" className="form-control" placeholder="Email Address" required />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <textarea placeholder="Your Message" className="form-control" name="message" rows="10" required></textarea>
                </div>

                <input type="hidden" name="_next" value="http://localhost:5173/sn-plus" />

                <button type="submit" className="btn btn-lg btn-dark btn-block">Submit Form</button>
            </form> */}
            </div>

            {/* Contact Form */}
            <div>
                {/* <Row>
                <Col>
                    <p>
                        Please keep your messages focused.
                        <br />
                        The character limit for your message is 1500.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Group className='mb-3' controlId='contactEmailFieldControl'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='email@example.com'
                                onChange={onMessageEmailChange}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='contactMessageFieldControl'>
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as='textarea'
                                value={messageText}
                                onChange={onMessageTextChange}
                                rows={3} />

                            <div
                                className={`mt-2 contact__message-char-counter ${messsageCharCount > messageCharLimit && 'extra'}`}
                            >
                                {`${messsageCharCount}/${messageCharLimit} characters`}
                            </div>

                        </Form.Group>

                        <div className='d-flex justify-content-end'>
                            <Button
                                onClick={handleMessageSubmission}
                                className='contact__message-send-btn'
                                disabled={messageText === '' || messsageCharCount > messageCharLimit ? true : false}
                            >
                                Send
                            </Button>
                        </div>

                    </Form>
                </Col>
            </Row> */}
            </div>

        </Container>
    )
}

export default Contact