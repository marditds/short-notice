import React from 'react';
import NavigationBar from './NavigationBar/NavigationBar';

const Header = ({ children }) => {
    return (
        <NavigationBar>{children}</NavigationBar>
    )
}

export default Header