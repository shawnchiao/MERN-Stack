import React from 'react';

import './MainHeader.css';

const MainHeader = proprs => {
    return <header className='main-header'> {proprs.children} </header>
}

export default MainHeader;