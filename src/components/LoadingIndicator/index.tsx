import React from 'react';
import './LoadingIndicator.scss';

const LoadingIndicator: React.FC = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            className="LoadingIndicator"
            width="50"
            height="50"
            fill="none"
            viewBox={`0 0 50 50`}>
            <circle
                cx="25"
                cy="25"
                r="21"
                stroke="hsl(30, 100%, 47%)"
                strokeWidth="8"
                strokeDasharray="20 24" />
        </svg>
    );
}

export default LoadingIndicator;