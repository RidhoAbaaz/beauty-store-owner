import { Link } from 'react-router-dom';
import styles from './NavButton.module.css';

export default function NavButton({ text, path, children = null, width, height }) {
    return (
        <Link style={{ textDecoration: "none", color: "black" }} to={ path }>
            <button className={styles.button} style={{ width: width, height: height }}>
                <p>{ text }</p>
                {children}
            </button>
        </Link>
    )
}