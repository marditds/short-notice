import { useState, useEffect } from 'react';

export const screenUtils = () => {

    const width = window.innerWidth;

    const [isExtraSmallScreen, setIsExtraSmallScreen] = useState(width < 576);

    const [isSmallScreen, setIsSmallScreen] = useState(width >= 576 && width < 768);

    const [isMediumScreen, setIsMediumScreen] = useState(width >= 768 && width < 992);

    const [isLargeScreen, setIsLargeScreen] = useState(width >= 992 && width < 1200);

    const [isExtraLargeScreen, setIsExtraLargeScreen] = useState(width >= 1200 && width < 1400);

    const [isDoubleExtraLargeScreen, setIsDoubleExtraLargeScreen] = useState(width >= 1400);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsExtraSmallScreen(width < 576);
            setIsSmallScreen(width >= 576 && width < 768);
            setIsMediumScreen(width >= 768 && width < 992);
            setIsLargeScreen(width >= 992 && width < 1200);
            setIsExtraLargeScreen(width >= 1200 && width < 1400);
            setIsDoubleExtraLargeScreen(width >= 1400);
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsExtraSmallScreen(window.innerWidth < 576);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsSmallScreen(window.innerWidth < 768);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsMediumScreen(window.innerWidth < 992);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, [])


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsLargeScreen(window.innerWidth < 1200);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, [])


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsExtraLargeScreen(window.innerWidth > 1400);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, [])


    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsDoubleExtraLargeScreen(window.innerWidth > 1400);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => window.removeEventListener('resize', handleResize);
    // }, [])

    return { isExtraLargeScreen, isLargeScreen, isMediumScreen, isSmallScreen, isExtraSmallScreen, isDoubleExtraLargeScreen }
}