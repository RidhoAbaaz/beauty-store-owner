import style from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className={style.sidebar}>
            <h3 className={style.companyName}>Dashboard Beauty Store</h3>
            <nav className={style.menu}>
                <NavLink 
                    to="/"
                    end
                    className={({ isActive }) => `${style.menuItem} ${isActive && style.active}`}>
                    <i className="bi bi-house"></i>Dashboard
                </NavLink>
                <NavLink 
                    to="/admin"
                    className={({ isActive }) => `${style.menuItem} ${isActive && style.active}`}>
                    <i className="bi bi-person-circle"></i>Admin
                </NavLink>
                <NavLink 
                    to="/orders"
                    className={({ isActive }) => `${style.menuItem} ${isActive && style.active}`}>
                    <i className="bi bi-file-text-fill"></i>Orders
                </NavLink>
            </nav>
        </aside>
    )
}