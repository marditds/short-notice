import React from 'react';
import { reportCategories, commGuideParags } from './communityGuidelines';
import { ListGroup } from 'react-bootstrap';

const CommunityGuidelinesList = () => {
    return (
        <>
            <h4 className='px-md-3'>
                Community Guidelines
            </h4>
            <p className='mb-1 px-md-3'>
                {commGuideParags.intro}
            </p>
            <p className='mb-1 px-md-3'>
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

            <p className='mb-1 px-md-3'>
                {commGuideParags.outro}
            </p>
        </>
    )
}

export default CommunityGuidelinesList;