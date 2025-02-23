import axios from 'axios'
import { useEffect, useState } from 'react';
import { Graph } from '../components/Graph';
import "./Administrator.css"
import NavBar from "../components/Navbar"

const Administrator = () => {
    const [users, setUsers] = useState()
    const [postive, setPositive] = useState()
    const [negative, setNegative] = useState()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/allUsers', {});
                console.log("Result:", response.data);
                setUsers(response.data)
            } catch (error) {
                console.error("Error running the Python script:", error);
            }
        }
        fetchData();
    }, [])

    return (
        <div className='background-administrator'>
            <NavBar/>
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