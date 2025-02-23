import axios from 'axios'
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import "../pages/Administrator.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const Graph = ({ user }) => {
    const [positiveHours, setPositiveHours] = useState({});
    const [negativeHours, setNegativeHours] = useState({});
    const [selectedDate, setSelectedDate] = useState(""); 
    const [availableDates, setAvailableDates] = useState([]);
    const [analysis, setAnalysis] = useState([])

    useEffect(() => {
        if (!user?.positive || !user?.negative) return;

        let updatedPositiveHours = {}; 
        let updatedNegativeHours = {}; 

        user.positive.forEach(entry => {
            const timestamp = new Date(entry.time);
            const date = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
            const hour = timestamp.getUTCHours().toString().padStart(2, '0'); // HH format

            if (!updatedPositiveHours[date]) {
                updatedPositiveHours[date] = Array(24).fill(0);
            }
            updatedPositiveHours[date][parseInt(hour)] += 1;
        });

        user.negative.forEach(entry => {
            const timestamp = new Date(entry.time);
            const date = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
            const hour = timestamp.getUTCHours().toString().padStart(2, '0'); // HH format

            if (!updatedNegativeHours[date]) {
                updatedNegativeHours[date] = Array(24).fill(0);
            }
            updatedNegativeHours[date][parseInt(hour)] += 1;
        });

        setPositiveHours(updatedPositiveHours);
        setNegativeHours(updatedNegativeHours);

        const dates = Object.keys(updatedPositiveHours).sort().reverse();
        setAvailableDates(dates);
        if (dates.length > 0) {
            setSelectedDate(dates[0]); // Default to most recent day
        }
    }, [user]);

    // Handle navigation
    const handlePreviousDay = () => {
        const currentIndex = availableDates.indexOf(selectedDate);
        if (currentIndex < availableDates.length - 1) {
            setSelectedDate(availableDates[currentIndex + 1]);
        }
    };

    const handleNextDay = () => {
        const currentIndex = availableDates.indexOf(selectedDate);
        if (currentIndex > 0) {
            setSelectedDate(availableDates[currentIndex - 1]);
        }
    };

    const handleGetAnalysis = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/analyze')
            console.log("Result:", response.data);
        } 
        catch (error) {
                console.error("Error running the Python script:", error);
        }
    }

    // Chart Data
    const data = {
        labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), // "00" to "23"
        datasets: [
            {
                label: 'Positive',
                data: positiveHours[selectedDate] || Array(24).fill(0),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Negative',
                data: negativeHours[selectedDate] || Array(24).fill(0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };

    return (
    <div className="admin-container">
        <div className="graph-container">
            <h2>Data for {user.name || "no name"}, {selectedDate || "No Data"}</h2>
            <button className="administrator" onClick={handlePreviousDay} disabled={availableDates.indexOf(selectedDate) === availableDates.length - 1}>
                Previous Day
            </button>
            <button className="administrator" onClick={handleNextDay} disabled={availableDates.indexOf(selectedDate) === 0}>
                Next Day
            </button>
            <Line data={data} />
            <button className='administrator' onClick={handleGetAnalysis}>
                Get Analysis
            </button>
        </div>
    </div>
    )    
};
