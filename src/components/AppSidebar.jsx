import React from 'react';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

const AppSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Harajatlar', icon: 'pi pi-home', command: () => navigate('/expenses') },
        { label: 'Kirim', icon: 'pi pi-user', command: () => navigate('/income') },
        { label: 'Ishchilar', icon: 'pi pi-envelope', command: () => console.log('Messages clicked') },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => console.log('Logout clicked') },
    ];

    return (
        <div className="flex flex-col h-screen w-64 bg-gray-800 text-white">
            <div className="text-center py-4 bg-blue-900">
                <h2 className="text-lg font-bold">App name</h2>
            </div>
            <div className="flex-1">
                <Menu model={menuItems} className="w-full" />
            </div>
        </div>
    );
};

export default AppSidebar;