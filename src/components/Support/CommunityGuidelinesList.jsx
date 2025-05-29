import { reportCategories, commGuideParags } from './communityGuidelines';
import { ListGroup } from 'react-bootstrap';

const CommunityGuidelinesList = () => {
    return (
        <section
            aria-labelledby='community-guidelines-heading'
            className='commGuide__section my-5'
        >
            <h2 id='community-guidelines-heading' className='commGuide__list-title'>
                Community Guidelines
            </h2>

            <p className='mb-1 commGuide__list-intro'>
                {commGuideParags.intro}
            </p>

            <p className='mb-1 commGuide__list-p'>
                {commGuideParags.pargraph}
            </p>

            <ListGroup
                as='ol'
                className='commGuide__list-group'
                aria-label='Categories of reportable behaviors'
            >
                {reportCategories.map((category, idx) => (
                    <ListGroup.Item
                        key={idx}
                        as='li'
                        className='commGuide__list-group-item ps-0'
                    >
                        <span className='fw-bold me-1'>{idx + 1}.</span> {category.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <p className='mb-1 commGuide__list-outro'>
                {commGuideParags.outro}
            </p>
        </section>


    )
}

export default CommunityGuidelinesList;