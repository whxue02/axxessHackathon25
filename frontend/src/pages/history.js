import NavbarPost from "../components/NavbarPost"
import axios from 'axios'
import { useEffect, useState } from 'react';
import {Graph} from '../components/Graph';
import "./Administrator.css"

export default function History() {
    const [email, setEmail] = useState("cxw230017@utdallas.edu")
    const [user, setUser] = useState()
    const [postive, setPositive] = useState()
    const [negative, setNegative] = useState()    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getUser', {
                    params: { email },  
                    withCredentials: true  
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error running the Python script:", error);
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <div className='background-administrator'>
            <NavbarPost/>
            <div >
                <p className='administrator'>Admin Page</p>
                { !user ? (
                    <p>Loading...</p>  
                ) : (         
                        <Graph key={user.id} user={user} />
                )}
            </div>
        </div>
    );
}