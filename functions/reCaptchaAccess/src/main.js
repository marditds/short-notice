export default async ({ req, res, log, error }) => {

    const token = req.body?.token;

    if (!token) {
        return res.json({ success: false, message: 'Missing reCAPTCHA token' });
    }

    try {
        const secretKey = process.env.CAPTCHA_SECRET_KEY;

        const verifyResponse = await fetch(
            'https://www.google.com/recaptcha/api/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${secretKey}&response=${token}`,
            }
        );

        const data = await verifyResponse.json();

        if (!data.success) {
            return res.json({ success: false, message: 'reCAPTCHA verification failed', errorCodes: data['error-codes'] });
        }

        log('reCAPTCHA verification passed.');
        return res.json({ success: true, message: 'reCAPTCHA validated successfully' });

    } catch (err) {
        error('Verification error: ' + err.message);
        return res.json({ success: false, message: 'Server error', error: err.message });
    }
};
