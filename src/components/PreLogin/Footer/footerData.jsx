import { BsTwitterX, BsInstagram, BsFacebook } from "react-icons/bs";


export const footerData = {

    navigationLinks: [
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
        { name: "SN Plus", url: "/sn-plus" },
        { name: "Terms of Service", url: "/tos" },
        { name: "Help Center", url: "/help-center" },
        { name: "Contact", url: "/contact" }
    ],

    socialLinks: [
        {
            id: 3, name: "X", url: "https://x.com", icon: <BsTwitterX />
        },
        {
            id: 2, name: "Instagram", url: "https://instagram.com", icon: <BsInstagram />
        },
        {
            id: 1, name: "Facebook", url: "https://facebook.com", icon: <BsFacebook />
        }
    ],

    copyright: `© ${new Date().getFullYear()} ShortNotice. All rights reserved.`,

};

// --------------------------------------------------
// | Home | About | Contact | Privacy | Terms | Help |
//     --------------------------------------------------
//         Follow Us: [FB][IG][X][YT]
//         © 2024 AppName.All rights reserved.
// --------------------------------------------------