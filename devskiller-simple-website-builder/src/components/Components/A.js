import React from 'react';

export const A = ({values}) => {
    const { href, label } = values;

    return (
        <a href={href} rel="noopener noreferrer" target="_blank">
            {label}
        </a>
    );
};
