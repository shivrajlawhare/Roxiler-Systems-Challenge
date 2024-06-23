import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = ({ month = '03' }) => {
    const [stats, setStats] = useState({ totalSales: 0, totalSold: 0, totalNotSold: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('https://roxiler-systems-challenge-server.onrender.com/api/transactions/statistics', { params: { month } });
            setStats(response.data);
        };

        fetchData();
    }, [month]);

    return (
        <div>
            <div>Total Sales: ${stats.totalSales}</div>
            <div>Total Sold Items: {stats.totalSold}</div>
            <div>Total Not Sold Items: {stats.totalNotSold}</div>
        </div>
    );
};

export default Statistics;
