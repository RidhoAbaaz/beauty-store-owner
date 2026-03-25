import { useContext, useEffect, useMemo, useState } from "react";
import { BaseUrl } from "../context/BaseUrl";
import { RequestHandler } from "../helper/requestHandler";
import styles from '../assets/styles/Dashboard.module.css'
import { formatRupiah } from "../helper/FormatRupiah";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Sidebar from "../componets/Sidebar/Sidebar";
import LoadingCard from "../componets/LoadingCard/LoadingCard";
import ErrorCard from "../componets/ErrorCard/ErrorCard";

export default function Dashboard() {
    const [orders, setOrders] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");

    const baseUrl = useContext(BaseUrl);

    useEffect(() => {
        const fecthContent = async () => {
            try {
                setIsLoading(true)
                const response = await RequestHandler(`${baseUrl}/orders`);
                setOrders(response.orders);
            } 
            catch (error) {
                setIsError(error.message);
                setTimeout(() => setIsError(""), 3000)
            }
            finally {
                setIsLoading(false);
            }
        }
        fecthContent();
    }, [baseUrl])

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthLabel = new Date(currentYear, currentMonth).toLocaleString("id-ID", { month: "long", year: "numeric" });

    const chartData = useMemo(() => {
        const weekIncome = [0, 0, 0, 0];

        if (orders && orders.length !== 0) {
            orders.forEach((order) => {
                const date = new Date(order.create_at);
                if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                    const weekIndex = Math.min(Math.floor((date.getDate() - 1) / 7), 3);
                    const total = order.total_price + order.ongkir;
                    weekIncome[weekIndex] += total;
                }
            });
        }

        return [
            { minggu: "Minggu 1", pendapatan: weekIncome[0] },
            { minggu: "Minggu 2", pendapatan: weekIncome[1] },
            { minggu: "Minggu 3", pendapatan: weekIncome[2] },
            { minggu: "Minggu 4", pendapatan: weekIncome[3] },
            ];
    }, [currentMonth, currentYear, orders]);

    return (
        <section className={styles.pageLayout}>
            <Sidebar />
            <header className={styles.header}>
                <h3>Dashboard</h3>
            </header>
            {
                isLoading ? <LoadingCard />
                : (
                    <main className={styles.mainContent}>
                        <div className={styles.wrapperGrafik}>
                            <h3>Pendapatan {monthLabel}</h3>
                            <div className={styles.grafik}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 24, left: 50, bottom: 8 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="minggu" />
                                        <YAxis tickFormatter={formatRupiah} />
                                        <Tooltip formatter={(value) => formatRupiah(value)} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="pendapatan"
                                            stroke="#8884d8"
                                            strokeWidth={3}
                                            dot={{ r: 5 }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </main>
                )
            }
            { isError && <ErrorCard message={isError} /> }
        </section>
    )
}