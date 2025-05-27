import { Row, Col } from 'react-bootstrap';
import { FeedToggle } from './FeedToggle';
import '../Feed.css';

export const FeedBody = ({ isFeedToggled, handleFeedToggle, handleRefresh, isAnyTagSelected, sideContent, children }) => {

    return (
        <>
            <header className='fixed-top w-100 mx-auto user-feed__header' role='banner'>
                <Row>
                    <Col>
                        <FeedToggle
                            isAnyTagSelected={isAnyTagSelected}
                            isFeedToggled={isFeedToggled}
                            handleFeedToggle={handleFeedToggle}
                            handleRefresh={handleRefresh}
                        />
                    </Col>
                </Row>
            </header>

            {/* Side section */}
            <Row className='position-relative'>
                <Col xs={3}
                    className='d-xl-block d-none w-25'
                    style={{
                        position: 'sticky',
                        top: '100px',
                        height: 'calc(100vh - 100px)',
                        overflowY: 'auto'
                    }}>
                    <aside
                        role='complementary'
                        aria-label='Feed tag selection'
                    >
                        {sideContent}
                    </aside>
                </Col>

                <Col xl={9} xs={12} className={`ms-auto`}>
                    <main id='main-content' aria-label='User feed notices'>
                        {children}
                    </main>
                </Col>

            </Row>
        </>
    )
}
