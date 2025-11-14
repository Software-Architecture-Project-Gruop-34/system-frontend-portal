import { Link } from 'react-router-dom';
import './NavBar.css'; // Assuming you have a CSS file for styling

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard">User Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;