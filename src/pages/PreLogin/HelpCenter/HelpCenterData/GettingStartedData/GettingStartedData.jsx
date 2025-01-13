import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GettingStartedData = () => {

    let { gettingStartedPath } = useParams();

    useEffect(() => {
        console.log('gettingStartedPath', gettingStartedPath);
    }, [gettingStartedPath])

    return (
        <div>This is {gettingStartedPath}</div>
    )
}

export default GettingStartedData;