import React from 'react';
import ContentLoader from 'react-content-loader';

type MyLoaderProps = {
    visible: boolean;
    count?: number;
    width?: number;
    height?: number;
    contentContainerClass?: string; // Tailwind support
    borderRadius: '' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
};

const MyLoader: React.FC<MyLoaderProps> = ({ visible, count = 1, width = 400, height = 80, contentContainerClass = '', borderRadius = '' }) => {
    if (!visible) return null;
    const spacing = 20;
    const rectHeight = height;
    const totalHeight = (rectHeight + spacing) * count;
    const radius = () => {
        switch (borderRadius) {
            case 'sm':
                return 4;
            case 'md':
                return 8;
            case 'lg':
                return 12;
            case 'xl':
                return 16;
            case '2xl':
                return 24;
            case 'full':
                return height / 2;
            default:
                return 6;
        }
    };

    return (
        <div className={`${contentContainerClass}`}>
            <ContentLoader
                speed={2}
                width={width}
                height={totalHeight}
                viewBox={`0 0 ${width} ${totalHeight}`}
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
            >
                {Array.from({ length: count }).map((_, index) => (
                    <rect key={index} x="0" y={index * (rectHeight + spacing)} rx={radius()} ry={radius()} width={width} height={rectHeight} />
                ))}
            </ContentLoader>
        </div>
    );
};

export default MyLoader;
