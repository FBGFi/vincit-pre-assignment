import React from 'react';
import './Page.scss';

type PageProps = {
    className?: string;
}

const Page: React.FC<PageProps> = (props) => {
    return(
        <main className={props.className || 'Page'}>
            {props.children}
        </main>
    );
}

export default Page;