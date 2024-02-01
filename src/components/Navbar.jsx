import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout, user, managerUser } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-emerald-500 my-3 flex flex-col md:flex-row justify-between py-5 px-10 rounded-lg">
      <div className='flex-row items-center'>
        {isAuthenticated? (
        <li className="text-white text-2xl font-extrabold px-4 py-1 rounded-md shadow-emerald-950">
            {user.UserName}
              </li>
          ): null}

      {/* Hamburger Icon for Mobile */}
      <div
        className="md:hidden cursor-pointer text-white text-2xl"
        onClick={handleMobileMenuToggle}
      >
        &#9776;
      </div>
      </div>
      {/* Navigation Links */}
      <ul
        className={`${
          isMobileMenuOpen ? 'flex flex-col' : 'hidden md:flex'
        } md:flex gap-x-2`}
      >
        {isAuthenticated ? (
          <>
            {managerUser ? (
              <li>
              <Link to="/admin-tasks"
              className="text-white px-4 font-bold py-1 rounded-md">
                Dev-tasks
              </Link>
            </li>
            ):null}
            
            <li>
            <Link to='/tasks'
              className="text-white px-4 font-bold py-1 rounded-md">
                Tareas
            </Link>
            </li>

            <li>
              <Link
                to="/add-task"
                className="text-white px-4 font-bold py-1 rounded-md"
              >
                Add Task
              </Link>
            </li>
            <li>
              <Link
                to="/reportes"
                className="text-white px-4 font-bold py-1 rounded-md"
              >
                Reportes
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => {
                  logout();
                }}
                className="hover:underline text-white font-bold decoration-wavy underline-offset-4"
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/"
                className="bg-emerald-700 text-white font-bold px-4 py-1 rounded-sm"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="bg-emerald-700 text-white px-4 font-bold py-1 rounded-sm"
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
