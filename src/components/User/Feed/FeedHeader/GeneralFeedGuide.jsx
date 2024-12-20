import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCircleExclamation } from "react-icons/fa6";


export const GeneralFeedGuide = ({ isTagSelected }) => {
    return (
        <h2 className='d-flex justify-content-start align-items-center mb-0'>

            {!isTagSelected &&
                <span>
                    <FaCircleExclamation /> To view notices in your general feed, set your interests in your profile <a href='../user/settings'>settings</a>.
                </span>
                // :
                // <OverlayTrigger
                //     placement="right"
                //     overlay={<Tooltip>{'Update you interests in your profile settings.'}</Tooltip>}>
                //     <Button className='user-feed__feed-guide-btn'>
                //         <FaCircleExclamation />
                //     </Button>
                // </OverlayTrigger>
            }
        </h2>
    )
}
