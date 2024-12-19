import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const AccountTypeDesc = ({ accountType }) => {
    return (
        <Row>
            <Col>
                {accountType === 'personal' && (
                    <>
                        <strong>For individual use.
                            <br />
                            Perfect for sharing personal updates and receiving feedback or reactions.
                        </strong>
                    </>
                )}
                {accountType === 'business' && (
                    <>
                        <strong>For business use.
                            <br />
                            Business accounts allow brands to share timely promotions, announcements, or messages.
                        </strong>
                    </>
                )}
                {accountType === 'organization' && (
                    <>
                        <strong>For organizations/teams.
                            <br />
                            A private space for leaders, teachers, or managers to share updates and announcements exclusively with their team members.
                        </strong>
                    </>
                )}
            </Col>
        </Row>
    )
}
