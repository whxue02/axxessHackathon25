import axios from 'axios'
import { useEffect, useState } from 'react';
import { Graph } from '../components/Graph';
import "./Administrator.css"
import NavbarPost from "../components/NavbarPost"
import api from '../api/axios'

const Administrator = () => {
    const [users, setUsers] = useState()
    const [postive, setPositive] = useState()
    const [negative, setNegative] = useState()    

    useEffect(() => {
        const fetchData = async () => {
            const email = "whxcollege@gmail.com";  
            try {
                const response = await api.get('http://127.0.0.1:5000/allUsers', {
                    params: { email },  
                    withCredentials: true  
                });
                console.log("Result:", response.data);
                setUsers(response.data);
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
                { !users ? (
                    <p>Loading...</p>  
                ) : (
                    users.map((user) => (
                        <Graph key={user.id} user={user} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Administrator