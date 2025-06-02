export default async ({ req, res, log, error }) => {

    try {

        log('Running geminiAccess function.');

        return res.json({ message: 'geminiAccess function ran successfully' });

    } catch (err) {
        error('Verification error: ' + err.message);
        return res.json({ success: false, message: 'Server error', error: err.message });
    }
};
