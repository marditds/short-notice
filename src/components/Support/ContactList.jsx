import React from 'react';

const ContactList = () => {
    return (
        <section aria-labelledby='contact-heading' className='contact-section my-5'>
            <h2 id='contact-heading' className='contact__title mb-0 mt-5 mt-lg-0 px-md-3'>
                Contact
            </h2>

            <div className='px-md-3'>
                <p className='contact__text mb-1'>
                    If you have any questions, concerns, or comments, please send a text message
                    <i className='bi bi-chat-left-dots ms-1 contact__icon' aria-hidden='true' />{' '}
                    to <a href='sms:18186900919' className='contact__phone-link'>(818) 690-0919</a>.
                </p>

                <p className='mb-1'>
                    <strong>Note: Calls to this number will not be answered.</strong>
                </p>

                <p>
                    Thank you <span className='contact__icon' role='img' aria-label='folded hands'>🙏</span> for your understanding and cooperation.
                </p>

                <p className='contact__text mb-1'>
                    Alternatively, you can email ShortNotice
                    <i className='bi bi-envelope ms-1 contact__icon' aria-hidden='true' /> at
                    <a href='mailto:shortnotice@altmails.com' className='contact__email-link ms-1'>
                        shortnotice@altmails.com
                    </a>.
                </p>
            </div>
        </section>

    )
}

export default ContactList