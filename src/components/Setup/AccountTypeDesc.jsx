export const AccountTypeDesc = ({ accountType }) => {
    return (
        <div className='mt-1' aria-live='polite'>
            {accountType === 'personal' && (
                <p>
                    <strong>For individual use.</strong><br />
                    Perfect for sharing personal updates and receiving feedback or reactions.
                </p>
            )}
            {accountType === 'business' && (
                <p>
                    <strong>For business use.</strong><br />
                    Business accounts allow brands to share timely promotions, announcements, or messages. Notices shared by business accounts are preceded by 'Ad:'.
                </p>
            )}
            {accountType === 'organization' && (
                <p>
                    <strong>For organizations and teams.</strong><br />
                    A private space for leaders, teachers, or managers to share updates and announcements exclusively with their group members.
                </p>
            )}
        </div>
    )
}
