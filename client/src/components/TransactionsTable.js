import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsTable = ({ month = '03', search, page, setPage }) => {
    const [transactions, setTransactions] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('https://roxiler-systems-challenge-server.onrender.com/api/transactions', {
                params: { month, search, page, perPage: 10 }
            });
            setTransactions(response.data.transactions);
            setTotal(response.data.total);
        };

        fetchData();
        console.log(total);
    }, [month, search, page, total]);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Date of Sale</th>
                        <th>Sold</th>
                        <th>Image</th> 
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.category}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            <td>{transaction.sold ? 'Yes' : 'No'}</td>
                            <td>
                                {transaction.image ? (
                                    <img src={transaction.image} alt="Transaction" style={{ width: '100px', height: 'auto' }} />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
};

export default TransactionsTable;
