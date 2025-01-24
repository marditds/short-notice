import appwrite_logo from '../../../assets/appwrite_logo.svg';
import recaptcha_logo from '../../../assets/reCAPTCHA-logo@2x.png';
import reactbootstrap_logo from '../../../assets/reactbootstrap.svg';
import googlesignin_logo from '../../../assets/web_neutral_rd_na.svg';
import tenor_logo from '../../../assets/tenor_logo.svg';

export const AttributionsData = () => {
    const attributesData = [
        {
            title: 'Appwrite',
            url: 'https://appwrite.io/',
            description: <span>The database and backend services are powered by <a href='https://appwrite.io/'><strong>Appwrite</strong></a>. ShortNotice does not rely on any other platforms for backend services.</span>,
            icon: appwrite_logo,
        },
        {
            title: 'Google reCAPTCHA v2',
            url: 'https://developers.google.com/recaptcha/docs/display',
            description: <span>ShortNotice uses Google's <a href='https://developers.google.com/recaptcha/docs/display'><strong>reCAPTCHA v2</strong></a> to prevent bots and other automated malicious activities.</span>,
            icon: recaptcha_logo,
        },
        {
            title: 'React-Bootstrap',
            url: 'https://react-bootstrap.github.io/',
            description: <span>Some user interface components were built using <a href='https://react-bootstrap.github.io/'><strong>React-Bootstrap</strong></a>. These components may have been customized to align with the platform's aesthetics.</span>,
            icon: reactbootstrap_logo,
        },
        {
            title: 'Sign in with Google',
            url: 'https://developers.google.com/identity/gsi/web/guides/overview',
            description: (
                <span>
                    Account creation and sign-in functionality are provided by <a href='https://developers.google.com/identity/gsi/web/guides/overview'><strong>Google</strong></a>.
                </span>
            ),
            icon: googlesignin_logo,
        },
        {
            title: 'Tenor GIF Keyboard',
            url: 'https://tenor.com/',
            description: (
                <span>
                    GIF functionality is powered by <a href='https://tenor.com/'><strong>Tenor</strong></a>.
                </span>
            ),
            icon: tenor_logo,
        },

    ];

    return { attributesData };
}