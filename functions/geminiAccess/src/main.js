export default async ({ req, res, log, error }) => {

    try {

        log('Running geminiAccess function.');

    } catch (err) {
        error('Verification error: ' + err.message);
        return res.json({ success: false, message: 'Server error', error: err.message });
    }
};
