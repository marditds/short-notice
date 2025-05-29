import { useParams, Link } from 'react-router-dom';
import { HelpCenterBreadCrumb } from './HelpCenterBreadCrumb';
import { ListGroup } from 'react-bootstrap';
import { HelpCenterArrs } from './HelpCenterArrs';

const HelpCenterTitlesPageContent = ({ isLoggedIn }) => {

    let { helpCenterTitlesPath } = useParams();

    const { topicTitleByPath, sectionTitleByPath, sectionTopicsByPath } = HelpCenterArrs();

    return (
        <>
            <HelpCenterBreadCrumb
                Link={Link}
                helpCenterTitlesPath={helpCenterTitlesPath}
                sectionTitleByPath={sectionTitleByPath}
                topicTitleByPath={topicTitleByPath}
                isLoggedIn={isLoggedIn}
            />

            <section aria-labelledby="help-topics-heading">
                <h4 id="help-topics-heading" className='help__center-titles-title fw-bold mt-2'>
                    {sectionTitleByPath[helpCenterTitlesPath] || 'Help Center'}
                </h4>
                <ListGroup as='ul' className='help__center-titles-list'>
                    {
                        sectionTopicsByPath[helpCenterTitlesPath].map((title, idx) => (
                            <ListGroup.Item as='li' className='help__center-titles-list-item' key={idx}>
                                <Link to={`./${title.path}`}>
                                    {title.header}
                                </Link>
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup>
            </section>

        </>
    )
}

export default HelpCenterTitlesPageContent