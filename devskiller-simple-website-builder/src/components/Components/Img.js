import React from 'react';

export const Img = ({values}) => {
    const { alt, src } = values;

    return <img alt={alt} src={src} />;
};