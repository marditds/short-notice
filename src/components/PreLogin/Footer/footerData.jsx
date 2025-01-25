import { Link } from "react-router-dom";

export const footerData = {
    company: [
        { name: "About", url: "/about" }
        // { name: "Blog", url: "/blog" }
    ],
    support: [
        { name: "Help Center", url: "/help-center" },
        { name: "Contact", url: "/contact" },
        { name: "Community Guidelines", url: "/community-guidelines" }
    ],
    explore: [
        { name: "SN Plus", url: "/sn-plus" },
        { name: "Attributions", url: "/attributions" },
    ],
    followUs: [
        { name: 'Facebook', url: 'https://facebook.com/', icon: <i className='bi bi-facebook' /> },
        { name: 'X', url: 'https://x.com/', icon: < i className='bi bi-twitter-x' /> },
        { name: 'Instagram', url: 'https://instagram.com/', icon: <i className='bi bi-instagram' /> },
    ],
    legal: [
        { name: "Terms of Service", url: "/tos" },
        { name: "Privacy Policy", url: "/privacy" }
    ],

    copyright: `© ${new Date().getFullYear()} ShortNotice.newLine All rights reserved.`,

    developer: <span>Developed by <Link target='_blank' to='https://marditds.netlify.app'>Mardit DerSoukiassian</Link>.</span>
};


// export const footerData = {

//     navigationLinks: [
//         { name: "Home", url: "/" },
//         { name: "About", url: "/about" },
//         { name: "SN Plus", url: "/sn-plus" },
//         { name: "Terms of Service", url: "/tos" },
//         { name: "Privacy Policy", url: "/privacy" },
//         { name: "Community Guidelines", url: "/community-guidelines" },
//         { name: "Help Center", url: "/help-center" },
//         { name: "Attributions", url: "/attributions" },
//         { name: "Contact", url: "/contact" }
//     ],

//     socialLinks: [
//         {
//             id: 3, name: "X", url: "https://x.com", icon: <i className='bi bi-twitter-x' />
//         },
//         {
//             id: 2, name: "Instagram", url: "https://instagram.com", icon: <i className='bi bi-instagram' />
//         },
//         {
//             id: 1, name: "Facebook", url: "https://facebook.com", icon: <i className='bi bi-facebook' />
//         }
//     ],

//     copyright: `© ${new Date().getFullYear()} ShortNotice. All rights reserved.`,

//     developer: <span>Developed by <Link target='_blank' to='https://marditds.netlify.app'>Mardit DerSoukiassian</Link>.</span>

// };

// --------------------------------------------------
// | Home | About | Contact | Privacy | Terms | Help |
//     --------------------------------------------------
//         Follow Us: [FB][IG][X][YT]
//         © 2024 AppName.All rights reserved.
// --------------------------------------------------