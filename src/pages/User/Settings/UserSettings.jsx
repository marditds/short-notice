import React, { useState, useEffect } from 'react';
import { Loading } from '../../../components/Loading/Loading.jsx'


const UserSettings = () => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        console.log('THIS IS USER SETTINGS PAGE.');

        setIsLoading(false);

    });

    if (isLoading) {
        return <div><Loading /></div>;
    }

    return (
        <div style={{ color: 'white' }}>THIS IS UserSettings</div>
    )
}

export default UserSettings