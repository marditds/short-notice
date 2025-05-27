import { Form, Row, Col, Button } from 'react-bootstrap';
import { screenUtils } from '../../../../lib/utils/screenUtils';

export const FeedToggle = ({ isFeedToggled, handleFeedToggle, handleRefresh, isAnyTagSelected }) => {

    const { isExtraLargeScreen, isDoubleExtraLargeScreen } = screenUtils();

    return (
        <Form
            className={`d-flex justify-content-center align-items-center ${isDoubleExtraLargeScreen || isExtraLargeScreen ? 'w-75 ms-auto' : 'w-100'}`}
            role='region'
            aria-label='Feed toggle controls'
        >
            <Form.Group as={Row} className='align-items-center'>

                {/* Personal Feed Button */}
                <Col xs='auto' className='d-flex align-items-center'>
                    <Button
                        className='py-0 px-1 mx-1 user-feed__refresh-btn'
                        style={{ visibility: !isFeedToggled ? 'visible' : 'hidden', height: '26px' }}
                        onClick={!isFeedToggled ? handleRefresh : null}
                        aria-label='Refresh personal feed'
                    >
                        <i className='bi bi-arrow-clockwise' aria-hidden='true'></i>
                    </Button>
                    <Button
                        className='p-0 m-0 user-feed__toggle-label bg-transparent border-0'
                        onClick={!isFeedToggled ? null : handleFeedToggle}
                        aria-pressed={!isFeedToggled}
                        aria-label='Switch to personal feed'
                    >
                        Personal Feed
                    </Button>
                </Col>

                {/* Toogle gear */}
                <Col xs='auto px-0'>
                    <Form.Check
                        type='switch'
                        id='feed-switch'
                        aria-label='Toggle between personal and general feed'
                        label=''
                        disabled={!isAnyTagSelected}
                        checked={isFeedToggled}
                        onChange={handleFeedToggle}
                        className='d-flex justify-content-center user-feed__toggle-btn'
                    />
                </Col>

                {/* General Feed Button */}
                <Col xs='auto' className='d-flex align-items-center'>

                    <Button
                        onClick={isFeedToggled || !isAnyTagSelected ? null : handleFeedToggle}
                        className={`p-0 m-0 user-feed__toggle-label bg-transparent border-0 ${!isAnyTagSelected && 'toggle-label-muted'}`}
                        aria-pressed={isFeedToggled}
                        aria-label='Switch to general feed'
                    >
                        General Feed
                    </Button>

                    <Button
                        className='py-0 px-1 mx-1 user-feed__refresh-btn'
                        style={{ visibility: isFeedToggled ? 'visible' : 'hidden', height: '26px' }}
                        onClick={isFeedToggled ? handleRefresh : null}
                        disabled={isAnyTagSelected ? false : true}
                        aria-label='Refresh general feed'
                    >
                        <i className='bi bi-arrow-clockwise' aria-hidden='true'></i>
                    </Button>
                </Col>
            </Form.Group>
        </Form>
    )
}
