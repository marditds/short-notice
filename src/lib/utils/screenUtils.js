import { useState, useEffect } from 'react'

export const screenUtils = () => {

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth < 992);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    const [isExtraSmallScreen, setIsExtraSmallScreen] = useState(window.innerWidth < 576);

    //Extra Small
    useEffect(() => {
        const handleResize = () => {
            setIsExtraSmallScreen(window.innerWidth < 576);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Small
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Large
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth < 576);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return { isLargeScreen, isSmallScreen, isExtraSmallScreen }
}