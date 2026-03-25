import { useState } from "react";
import styles from './AddAdmin.module.css';
import { RequestHandler } from "../../helper/requestHandler";
import Input from "../Input/Input";

export default function AddAdmin({ handler, setRefresh, setLoading, setError, setSuccess, baseUrl }) {
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        password: "",
        email: "",
        phone_number: ""
    });
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        handler("");
        setLoading(true);
        try {
            const response = await RequestHandler(`${baseUrl}/adminSignup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAdmin)
            });
            setSuccess(response.message);
            setTimeout(() => {
                setSuccess("")
                setRefresh(prev => !prev);
            }, 3000);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(""), 3000)
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (name, value) => {
        setNewAdmin(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className={styles.overlay}>
            <form className={styles.layout} onSubmit={handleSubmit}>
                <h4 className={styles.header}>Add Address</h4>
                <Input name="name" label="Username" value={newAdmin.name} handler={ handleChange } placeholder="Input Username" type="text"/>
                <Input name="email" label="Email" value={newAdmin.email} handler={ handleChange } placeholder="Input Email Address" type="email"/>
                <Input name="password" label="Password" value={newAdmin.password} handler={ handleChange } placeholder="Input Password" type="text"/>
                <Input name="phone_number" label="Phone Number" value={newAdmin.phone_number} handler={ handleChange } placeholder="Input Phone Number" type="number"/>
                <div className={styles.btnWrapper}>
                    <button type="submit" className={styles.backBtn}>Add Admin</button>
                    <button className={styles.backBtn} onClick={() => handler("")}>Close</button>
                </div>
            </form>
        </div>
    )
}