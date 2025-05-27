import { ListGroup } from 'react-bootstrap';
import { tosData } from './tosData';

const TOSList = () => {
    return (
        <section aria-labelledby='tos-heading'>

            <h2 id='tos-heading' className='ps-0 ps-sm-3'>
                Terms of Service
            </h2>
            <ListGroup as={'ol'} className={'tos__list-group'}>
                {tosData.map((term, idx) => {
                    return (
                        <ListGroup.Item key={idx} as={'li'} className={'tos__list-group-item'}>
                            <h3 tabIndex={-1} className='heading-h5-style mb-1'>
                                {idx + 1}. {term.title}
                            </h3>

                            <div>
                                {term.description.split('\n').map((line, index) => (
                                    <p key={index} className='mb-2'>{line}</p>
                                ))}
                            </div>
                        </ListGroup.Item>
                    )
                })
                }
            </ListGroup>
        </section>
    )
}

export default TOSList;