import { LucideIcon } from 'lucide-react';
import { HTMLProps } from 'react';

interface IconProps {
    iconNode?: LucideIcon | null;
    className?: HTMLProps<HTMLElement>['className'];
}

export function Icon({ iconNode: IconComponent, className }: IconProps) {
    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
}
