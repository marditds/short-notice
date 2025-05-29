import { Nav } from 'react-bootstrap';

export const HelpCenterBreadCrumb = ({ Link, helpCenterTitlesPath, sectionTitleByPath, helpCenterDataPath, topicTitleByPath, isLoggedIn }) => {
    return (
        <>
            <Nav as='nav' aria-label='breadcrumb' className='help-center__breadcrumb'>
                <Nav.Item as='ol' className='breadcrumb d-inline-flex align-items-center mb-0'>

                    <Nav.Item as='li' className='breadcrumb-item'>
                        <Nav.Link as={Link} to={`${!isLoggedIn ? '' : '/user'}/help-center`} className='help-center__breadcrumb-link'>
                            Help Center
                        </Nav.Link>
                    </Nav.Item>

                    <li className='px-3' aria-hidden='true'>/</li>

                    <Nav.Item as='li' className='breadcrumb-item'>
                        <Nav.Link as={Link} to={`${!isLoggedIn ? '' : '/user'}/help-center/${helpCenterTitlesPath}`} className='help-center__breadcrumb-link'>
                            {sectionTitleByPath[helpCenterTitlesPath]}
                        </Nav.Link>
                    </Nav.Item>

                    {helpCenterDataPath && (
                        <>
                            <li className='px-3' aria-hidden='true'>/</li>
                            <Nav.Item as='li' className='breadcrumb-item active' aria-current='page'>
                                {topicTitleByPath[helpCenterTitlesPath]?.[helpCenterDataPath]}
                            </Nav.Item>
                        </>
                    )}

                </Nav.Item>
            </Nav>
            <hr className='mt-0 mb-0 mb-sm-2' />
        </>
    )
}
