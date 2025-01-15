import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCenterArrs } from './HelpCenterArrs';
import { Container, ListGroup } from 'react-bootstrap';

const HelpCenterData = () => {

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    const { titleDataMapping, titlesDataMap } = HelpCenterArrs();

    useEffect(() => {
        console.log('gettingStartedPath', helpCenterDataPath);
    }, [helpCenterDataPath])

    return (
        <Container>
            <h4> {
                titleDataMapping[helpCenterTitlesPath]?.[helpCenterDataPath]
                || 'Title not found'
            }</h4>

            <div>
                <p className='mb-2'>{titlesDataMap[helpCenterDataPath].intro}</p>
                <ListGroup as='ol' className='help__center-data-list'>
                    {titlesDataMap[helpCenterDataPath].steps.map((step, idx) => (
                        <ListGroup.Item key={idx} as='li' className='help__center-data-list-item aaa'>
                            <strong>
                                {titlesDataMap[helpCenterDataPath].steps.indexOf(step) + 1}.
                            </strong>
                            {'  '}{step}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <p className='mt-2'>{titlesDataMap[helpCenterDataPath].outro}</p>
            </div>

        </Container>
    )
}

export default HelpCenterData;