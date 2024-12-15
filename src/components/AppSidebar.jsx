import React from 'react';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

const AppSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Income', icon: 'pi pi-chart-line', command: () => navigate('/incomes') },
        { label: 'Expenses', icon: 'pi pi-receipt', command: () => navigate('/expenses') },
        { label: 'Workers', icon: 'pi pi-users', command: () => navigate('/workers') },
        { label: 'Projects', icon: 'pi pi-briefcase', command: () => navigate('/projects') },
        { label: 'Expense Categories', icon: 'pi pi-receipt', command: () => navigate('/expense-categories') },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-sign-out', command: () => console.log('Logout clicked') },
    ];

    return (
        <div className="flex flex-col h-svh w-64 bg-gray-800 text-white">
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