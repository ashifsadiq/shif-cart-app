import { cn } from '@/lib/utils';
import Navbar from '@/pages/Components/Navbar';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { HTMLProps, ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
    className?: HTMLProps<HTMLElement>['className'];
    customTitle?: string;
    [key: string]: any; // Allow additional props
}
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
export default ({ children, breadcrumbs, className, ...props }: AppLayoutProps) => {
    const title = props.customTitle ? props.customTitle : `${props.title} - ${appName}`;
    return (
        <div>
            <Head title={title}>
                {props.description && <meta name="description" content={props.description} />}
            </Head>
            <Navbar />
            <div className={cn(className)}>{children}</div>
        </div>
    );
};
