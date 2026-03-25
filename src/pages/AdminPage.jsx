import { useContext, useEffect, useState } from 'react';
import styles from '../assets/styles/AdminPage.module.css';
import Sidebar from '../componets/Sidebar/Sidebar';
import { RequestHandler } from '../helper/requestHandler';
import { BaseUrl } from '../context/BaseUrl';
import ErrorCard from '../componets/ErrorCard/ErrorCard';
import AdminRow from '../componets/AdminRow/AdminRow';
import LoadingCard from '../componets/LoadingCard/LoadingCard';
import { Link } from 'react-router-dom';
import AddAdmin from '../componets/AddAdmin/AddAdmin';
import SuccessCard from '../componets/SuccessCard/SuccessCard';
import DeleteCard from '../componets/ConfirmCard/DeleteCard';

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [isSuccess, setIsuccess] = useState("");

    const [view, setView] = useState("");
    const [refresh, setRefresh] = useState(false);

    const [admin, setAdmin] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    const baseUrl = useContext(BaseUrl);

    const [search, setSearch] = useState("");

    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/users`);
                setAdmin(response.admin);
            } catch (error) {
                setIsError(error.message);
                setTimeout(() => setIsError(""), 3000);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [baseUrl, refresh]);

    const filteredAdmin = admin.filter(item => 
        search ? item.name.toLowerCase().includes(search.toLowerCase().trim()) : true
    )

    const getId = (id, view) => {
        setSelectedId(id);
        setView(view)
    }

    const deleteHandler = async () => {
        setView("");
        setIsLoading(true);
        try {
            const response  = await RequestHandler(`${baseUrl}/user/${selectedId}`, {
                method: "DELETE"
            });
            setIsuccess(response.message);
            setTimeout(() => {
                setIsuccess("");
                setSelectedId("");
                setRefresh(prev => !prev)
            }, 3000);
        } catch (error) {
            setIsError(error.message);
            setTimeout(() => {
                setIsError("");
                setSelectedId("");
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    }

    console.log(`ini nilai dari view ${view}`)

    return (
        <section className={styles.pageLayout}>
            <Sidebar />
            <header className={styles.header}>
                <h3>Admin</h3>
            </header>
            {
                isLoading ? <LoadingCard /> : (
                    <main className={styles.mainContent}>
                        <div className={styles.toolbar}>
                            <p>{ admin.length } Users</p>
                            <div className={styles.inputContainer}>
                                <label className={styles.searchLabel} htmlFor="searchInput">
                                    Search
                                </label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="searchInput"
                                        className={styles.searchInput}
                                        type="text"
                                        placeholder="Cari Admin"
                                        value={search}
                                        onChange={handleChange}
                                    />
                                    {search === "" ? null : <i className="bi bi-x-circle" onClick={() => setSearch("")} style={{ cursor: "pointer" }}></i>}    
                                </div>
                            </div>
                            <button className={styles.donwloadBtn} onClick={() => setView("add")}>
                                <p>Add Admin</p>
                                <i className="bi bi-plus-circle"></i>
                            </button>
                        </div>
                        <div className={styles.adminWrapper}>
                            {
                                filteredAdmin.length !== 0 ? (
                                    filteredAdmin.map(item => (
                                        <AdminRow
                                            key={item.user_id}
                                            name={item.name}
                                            email={item.email}
                                            phoneNumber={item.phone_number}
                                            handler={(value) => getId(item.user_id, value)}
                                        />
                                    ))
                                ) : (
                                    <div className={styles.empty}>
                                        <p>Admin tidak Terdaftar</p>
                                    </div>
                                )
                            }
                        </div>
                    </main>
                )
            }
            { isError && <ErrorCard message={isError} /> }
            { isSuccess && <SuccessCard message={isSuccess} /> }
            { view === "add" && <AddAdmin 
                setRefresh={setRefresh}
                setLoading={setIsLoading}
                setSuccess={setIsuccess}
                setError={setIsError}
                baseUrl={baseUrl}
                handler={setView}
            /> }
            { view === "delete" && <DeleteCard 
                message="apakah kamu yakin ingin menghapus user?"
                confirmText='Hapus'
                cancelText='Batal'
                onConfirm={deleteHandler}
                onCancel={() => setView("")}
            /> }
        </section>
    )
}