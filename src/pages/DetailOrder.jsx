import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BaseUrl } from "../context/BaseUrl";
import { RequestHandler } from "../helper/requestHandler";
import styles from '../assets/styles/DetailOrder.module.css';
import Sidebar from "../componets/Sidebar/Sidebar";
import NavButton from "../componets/NavButton/NavButton";
import LoadingCard from "../componets/LoadingCard/LoadingCard";
import OrderItem from "../componets/OrderItem/OrderItem";
import ErrorCard from "../componets/ErrorCard/ErrorCard";
import SummaryRow from "../componets/Summary/SummaryRow";
import ExpRow from "../componets/Exp/ExpRow";
import Info from "../componets/Info/Info";

export default function DetailOrder() {
    const [order, setOrder] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");

    const { orderId } = useParams();

    const baseUrl = useContext(BaseUrl);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/order/${orderId}`)
                setOrder(response.order);
            } catch (error) {
                setIsError(error.message);
                setTimeout(() => setIsError(""), 3000)
            } finally {
                setIsLoading(false)
            }
        }
        fetchContent();
    }, [baseUrl, orderId]);

    const location = useLocation()
    const from = location.state || "";


    const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);
    const statusKey = (order.status || "").toLowerCase();
    return(
        <section className={styles.pageLayout}>
            <Sidebar />
            <header className={styles.header}>
                <h3>Detail Order</h3>
                <div className={styles.headerBtn}>
                    <NavButton text="Back" path={ from } width="70px" height="30px" />
                </div>
            </header>
            {
                isLoading ? <LoadingCard /> : (
                    <main className={styles.mainContent}>
                        <div className={styles.toolbar}>
                            <p>{ order.order_id }</p>
                            <span className={`${styles.statusBadge} ${styles[`badge_${statusKey}`] || ""}`}>
                                {order.status}
                            </span>
                        </div>
                        {/* container 2 */}
                        <div className={styles.itemWrap}>
                            {
                                order.orderItem && order.orderItem.map(item => 
                                    <OrderItem
                                        key={item.product_id} 
                                        nama={item.name} 
                                        brand={item.brand}
                                        price={item.price}
                                        varian={item.variant}
                                        qty={item.qty}
                                        total={item.sub_total}
                                        image_url={item.image_url}
                                    />
                                )
                            }
                        </div>
                        {/* container 3 */}
                        <aside className={styles.summaryWrap}>
                            <div className={styles.summary}>
                                <h3 className={styles.title}>Order Summary</h3>
                                <SummaryRow title="Total Product" value={ order.total_product }/>
                                <SummaryRow title="Total Item" value={ order.total_item }/>
                                <SummaryRow title="Ongkir" value={formatRupiah(order.ongkir)}/>
                                <div className={styles.line}></div>
                                <div className={styles.total}>
                                    <p>Total :</p>
                                    <p>{ formatRupiah(order.total_price) }</p>
                                </div>
                            </div>
                            <table className={styles.ExpDate}>
                                <thead>
                                    <tr>
                                        <th colSpan="2" className={styles.title} >Expired Date</th>
                                    </tr>
                                    <tr className={styles.headerRow}>
                                        <th className={styles.productName}>Product</th>
                                        <th className={styles.date}>Expired Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        order.orderItem && order.orderItem.map(item => (
                                            item.recaps.map(recap => 
                                                <ExpRow key={recap.batch_code} product={item.name} expDate={recap.exp_date} />
                                            )
                                        ))
                                    }
                                </tbody>
                            </table>
                        </aside>
                        {/* container 4 */}
                        <div className={styles.moreInfo}>
                            <Info label="Address" data={order.address} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Payment" data={order.payment} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Receiver" data={order.receiver} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Order Date" data={order.create_at && order.create_at.slice(0, 10)} width="100px" fontData="15px" fontLabel="20px"/>
                            <Info label="Phone Number" data={order.phone_number} width="100px" fontData="15px" fontLabel="20px"/>
                        </div>
                    </main>
                )
            }
            { isError && <ErrorCard message={isError} /> }
        </section>
    )
}