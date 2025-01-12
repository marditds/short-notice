import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const HelpCenterData = () => {

    let { helpCenterPath } = useParams();
    const location = useLocation();


    const data = {
        'getting-started': 'aaaaaaaaaaaaaaa',
        'manage-account': 'bbbbbbbbbbbbbbb'
    }


    useEffect(() => {
        console.log('Pathname:', location.pathname);
    })


    useEffect(() => {
        console.log('helpCenterPath', helpCenterPath);
    }, [helpCenterPath])

    // useEffect(() => {
    //     console.log('getting-started', data[helpCenterPath]);
    // }, [helpCenterPath])


    return (
        <div>
            {data[helpCenterPath]}
        </div>
    )
}

export default HelpCenterData;