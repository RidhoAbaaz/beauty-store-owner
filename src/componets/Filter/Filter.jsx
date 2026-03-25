import styles from './Filter.module.css';

export default function Filter( { title, name, value, handler }) {
    const date = value.slice(0, 10);
    return (
        <div className={styles.filterBlock}>
            <h3 className={styles.filterLabel}>{ title }</h3>
            <input className={styles.filterSelect} type="date" name={ name } id={ name } value={ date } onChange={(e) => handler(e.target.value, e.target.name)}/>
        </div>
    )
}