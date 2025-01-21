export const PrivacyData = () => {

  const privacyPolicyData = [
    {
      title: "Introduction",
      description: "This Privacy Policy outlines how ShortNotice ('we,' 'us,' or 'our') collects, uses, shares, and protects user data. By using ShortNotice, users agree to the practices described in this policy."
    },
    {
      title: "Data Collection",
      description:
        <div>
          We collect the following data:
          <ul className='list-unstyled'>
            <li>- Google Account Information: Email address and given name associated with your Google account.</li>
            <li>- Content Shared: Any text, images, or other media shared by users on the platform.</li>
            <li>- Technical Data: IP address and usage logs collected by Appwrite on behalf of ShortNotice. This data is accessible to ShortNotice through Appwrite and is primarily used for debugging and maintaining platform security.</li>
          </ul>
        </div>
    },
    {
      title: "Data Usage",
      description:
        <div>
          The data we collect is used to:
          <ul className='list-unstyled'>
            <li>- Facilitate account creation and login using Google authentication.</li>
            <li>- Display content and enable interactions within the platform.</li>
            <li>- Moderate and enforce our Terms of Service and Community Guidelines.</li>
            <li>- Improve platform functionality and user experience.</li>
          </ul>
        </div>
    },
    {
      title: "Data Sharing",
      description:
        <div>
          ShortNotice does not sell or rent user data to third parties. However, data may be shared in the following instances:
          <ul className='list-unstyled'>
            <li>- Service Providers: We rely on Appwrite for data storage and backend services. Appwrite collects and stores user data, including IP addresses, on our behalf. Your data is stored within Appwrite's infrastructure.</li>
            <li>- Legal Requirements: If required by law, we may disclose user data to comply with legal processes.</li>
            <li>- Platform Integrity: In cases of reported content or account violations, data may be reviewed internally for resolution.</li>
          </ul>
        </div>
    },
    {
      title: "Data Storage and Security",
      description:
        <div>
          Your data is stored within Appwrite's servers. While we strive to protect your data, ShortNotice is a personal project without advanced security features, such as encryption or multi-factor authentication. Users are encouraged to:
          <ul className='list-unstyled'>
            <li>- Use strong passwords for their Google accounts.</li>
            <li>- Avoid sharing sensitive or personal information on the platform. </li>
          </ul>
        </div>
    },
    {
      title: "User Rights",
      description: `
      Users have the right to report privacy violations through the 'Privacy Violation' category in the Community Guidelines.
    `
    },
    {
      title: "Cookies and Tracking",
      description: `
      ShortNotice may use cookies or similar technologies to enhance functionality. These cookies are used for session management and do not track users outside the platform.
    `
    },
    {
      title: "Children\'s Privacy",
      description: `
      ShortNotice is not intended for users under the age of 18. We do not knowingly collect data from children. If we become aware of such data collection, it will be promptly deleted.
    `
    },
    {
      title: "Updates to This Policy",
      description: `
      This Privacy Policy may be updated periodically. Users will be notified of changes through platform announcements. Continued use of ShortNotice after updates constitutes acceptance of the revised policy.
    `
    },
    {
      title: "Contact Information",
      description: `
      For questions or concerns about this Privacy Policy, please contact us at: shortnotice@altmails.com.
    `
    }
  ];

  return { privacyPolicyData };
}


