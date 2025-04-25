import React from 'react';
import { reportCategories, commGuideParags } from './communityGuidelines';
import { ListGroup } from 'react-bootstrap';

const CommunityGuidelinesList = () => {
    return (
        <>
            <h4 className='px-md-3 commGuide__list-title'>
                Community Guidelines
            </h4>
            <p className='mb-1 px-md-3 commGuide__list-intro'>
                {commGuideParags.intro}
            </p>
            <p className='mb-1 px-md-3 commGuide__list-p'>
                {commGuideParags.pargraph}
            </p>

            <ListGroup as={'ol'} className='commGuide__list-group'>
                {
                    reportCategories.map((category, idx) => {
                        return (
                            <ListGroup.Item key={idx} as={'li'} className='commGuide__list-group-item'>
                                {idx + 1}. {category.name}
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>

            <p className='mb-1 px-md-3 commGuide__list-outro'>
                {commGuideParags.outro}
            </p>
        </>
    )
}

export default CommunityGuidelinesList;