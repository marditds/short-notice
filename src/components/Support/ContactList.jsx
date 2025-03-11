import React from 'react';

const ContactList = () => {
    return (
        <>
            <h4 className='contact__title mb-0 mt-3 mt-lg-0 px-md-3'>Contact</h4>

            <p className='contact__text mb-1 px-md-3'>If you have any questions, concerns, or comments, please send a text message <i className='bi bi-chat-left-dots fs-5' /> to (818)690-0919.
            </p>

            <p className='mb-1 px-md-3'>
                <strong>
                    Note: Calls to this number will not be answered.
                </strong>
            </p>
            <p className='px-md-3'> Thank you <span className='fs-5'>🙏</span> for your understanding and cooperation.
            </p>
            <p className='contact__text mb-1 px-md-3'>
                Alternatively, you can email ShortNotice at <i className='bi bi-envelope fs-5' /> to  <a href='mailto:shortnotice@altmails.com' className='contact__email-link'>shortnotice@altmails.com</a>.
            </p>
        </>
    )
}

export default ContactList