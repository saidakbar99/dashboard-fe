import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';

const AppSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  const menuItems = [
    { label: 'Income', icon: 'pi pi-chart-line', command: () => {navigate('/incomes'); onClose()} },
    { label: 'Expenses', icon: 'pi pi-receipt', command: () => {navigate('/expenses'); onClose()} },
    { label: 'Workers', icon: 'pi pi-users', command: () => {navigate('/workers'); onClose()} },
    { label: 'Projects', icon: 'pi pi-briefcase', command: () => {navigate('/projects'); onClose()} },
    { label: 'Expense Categories', icon: 'pi pi-receipt', command: () => {navigate('/expense-categories'); onClose()} },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => handleLogout() },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-800 text-white z-40 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 sm:static sm:translate-x-0 sm:w-64`}
      >
        <div className="flex justify-between items-center bg-blue-900 p-4">
          <h2 className="text-lg font-bold">App name</h2>
          <button
            className="text-white text-2xl sm:hidden"
            onClick={onClose}
          >
            <i className="pi pi-times"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Menu model={menuItems} className="w-full" />
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default AppSidebar;