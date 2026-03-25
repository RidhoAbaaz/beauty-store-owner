import { useContext, useEffect, useState } from "react";
import styles from '../assets/styles/OrderPage.module.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RequestHandler } from "../helper/requestHandler";
import Sidebar from "../componets/Sidebar/Sidebar";
import { getMonthRange } from "../helper/getMonthRange";
import Filter from "../componets/Filter/Filter";
import ErrorCard from "../componets/ErrorCard/ErrorCard";
import LoadingCard from "../componets/LoadingCard/LoadingCard";
import OrderCard from "../componets/OrderCard/OrderCard";
import { BaseUrl } from "../context/BaseUrl";
import { jsonToCsv } from "../helper/JsonToCsv";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");

    const baseUrl = useContext(BaseUrl);

    const navigate = useNavigate();
    const location = useLocation();

    const { start, end } = getMonthRange()

    const useGetQuery = () => {
        const { search } = useLocation();
        return Object.fromEntries(new URLSearchParams(search).entries());
    }
    
    const { startOfMonth = start, endOfMonth = end } = useGetQuery();

    const donwloadHandler = () => {
        const parseCsv = jsonToCsv(filteredOrder);
        const blob = new Blob([parseCsv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reports.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/orders`);
                setOrders(response.orders);
            } catch (error) {
                setIsError(error.message);
                setTimeout(() => setIsError(""), 3000)
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchContent();
    }, [baseUrl]);

    const changeDropdown = (value, name) => {
        const newParams = new URLSearchParams(location.search);
        if (name === "start") {
            const data = value === undefined ? "" : value;
            const date = new Date(data).toISOString();
            newParams.set('startOfMonth', date);
        }
        else {
            const data = value === undefined ? "" : value; 
            newParams.set('endOfMonth', data);
        }
        navigate(`/orders?${newParams.toString()}`)
    };

    const filteredOrder = orders.filter(item => 
        item.create_at >= startOfMonth && item.create_at <= endOfMonth
    );

    return (
        <section className={styles.pageLayout}>
            <Sidebar />
            <header className={styles.header}>
                <h3>Orders</h3>
            </header>
            {
                isLoading ? <LoadingCard /> : (
                    <main className={styles.mainContent}>
                        <div className={styles.toolbar}>
                            <p>{ orders.length } Orders</p>
                            <button className={styles.donwloadBtn} onClick={donwloadHandler}>
                                <p>Download Laporan</p>
                                <i className="bi bi-download"></i>
                            </button>
                        </div>
                        <div className={styles.filterWrapper}>
                            <Filter
                                title="Start Of Month"
                                name="start"
                                value={startOfMonth}
                                handler={changeDropdown}
                            />
                            <Filter
                                title="End Of Month"
                                name="end"
                                value={endOfMonth}
                                handler={changeDropdown}
                            />
                        </div>
                        <div className={styles.orderWrapper}>
                            {
                                filteredOrder.length !== 0 ? (
                                    filteredOrder.map(item => (
                                        <Link key={ item.order_id } to={`/orders/${item.order_id }`} style={{ textDecoration: "none", color: "black" }} state={ location.pathname + location.search }>
                                            <OrderCard 
                                                orderID={item.order_id}
                                                status={item.status}
                                                date={item.create_at}
                                                totalProduct={item.total_product}
                                                totalItem={item.total_item}
                                                price={item.total_price}
                                                payment={item.payment}
                                            />
                                        </Link>
                                    ))
                                ) : (
                                    <div className={styles.empty}>
                                        <p>Pesanan tidak tersedia</p>
                                    </div>
                                )
                            }
                        </div>
                    </main>
                )
            }
        { isError && <ErrorCard message={isError} /> }
        </section>
    )
}