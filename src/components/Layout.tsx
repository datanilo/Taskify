import Navbar from '@/components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='w-full'>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Layout;