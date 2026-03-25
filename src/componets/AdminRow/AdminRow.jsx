import styles from './AdminRow.module.css';

export default function AdminRow({ name, phoneNumber, email, handler }) {
    return (
        <div className={styles.card}>
            <div className={styles.row}>
                <h4>Admin Name</h4>
                <p> { name } </p>
            </div>
            <div className={styles.row}>
                <h4>Phone Number</h4>
                <p> { phoneNumber } </p>
            </div>
            <div className={styles.row}>
                <h4> Email </h4>
                <p> { email } </p>
            </div>
            <i className={`bi bi-trash ${styles.icon}`} onClick={() => handler("delete")}></i>
        </div>
    )
}