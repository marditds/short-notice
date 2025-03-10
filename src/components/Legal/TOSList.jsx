import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { tosData } from './tosData';

const TOSList = () => {
    return (
        <ListGroup as={'ol'} className={'tos__list-group'}>
            <h3 className='ps-0 ps-sm-3'>Terms of Service</h3>
            {
                tosData.map((term, idx) => {
                    return (
                        <ListGroup.Item key={idx} as={'li'} className={'tos__list-group-item'}>
                            <h5 className='mb-1'>{idx + 1}. {term.title}</h5>
                            <p>{term.description}</p>
                        </ListGroup.Item>
                    )
                })
            }
        </ListGroup>
    )
}

export default TOSList;