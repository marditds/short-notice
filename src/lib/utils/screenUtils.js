import { useState, useEffect } from 'react';

export const screenUtils = () => {

    const [isExtraLargeScreen, setIsExtraLargeScreen] = useState(window.innerWidth < 1400);

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth < 1200);

    const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 992);

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

    // Medium
    useEffect(() => {
        const handleResize = () => {
            setIsMediumScreen(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    // Large
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    // Extra Large
    useEffect(() => {
        const handleResize = () => {
            setIsExtraLargeScreen(window.innerWidth < 1400);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return { isExtraLargeScreen, isLargeScreen, isMediumScreen, isSmallScreen, isExtraSmallScreen }
}