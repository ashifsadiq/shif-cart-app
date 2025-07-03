import Navbar from '@/pages/Components/Navbar';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
    [key: string]: any; // Allow additional props
}
export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <div>
        <Head title={props.title ?? ''}>
            {props.description && <meta name="description" content={props.description} />}
            <link rel="preconnect" href="https://fonts.bunny.net" />
            <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        </Head>
        <Navbar />
        {children}
    </div>
);
