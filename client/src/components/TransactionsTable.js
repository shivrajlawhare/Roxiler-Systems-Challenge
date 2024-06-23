import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionsTable = ({ month = "03", search, page, setPage }) => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://roxiler-systems-challenge-server.onrender.com/api/transactions",
        {
          params: { month, search, page, perPage: 10 },
        }
      );
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    };

    fetchData();
    console.log(total);
  }, [month, search, page, total]);

  return (
    <div className="mx-56">
      <table class="table-auto bg-yellow-200  ">
        <thead>
          <tr>
            <th className="border-2 border-black p-4 ">Title</th>
            <th className="border-2 border-black p-4">Description</th>
            <th className="border-2 border-black p-4">Price</th>
            <th className="border-2 border-black p-4">Category</th>
            <th className="border-2 border-black p-4">Date of Sale</th>
            <th className="border-2 border-black p-4">Sold</th>
            <th className="border-2 border-black p-4">Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="border-2 border-black p-4">{transaction.title}</td>
              <td className="border-2 border-black p-4">
                {transaction.description}
              </td>
              <td className="border-2 border-black p-4">{transaction.price}</td>
              <td className="border-2 border-black p-4">
                {transaction.category}
              </td>
              <td className="border-2 border-black p-4">
                {new Date(transaction.dateOfSale).toLocaleDateString()}
              </td>
              <td className="border-2 border-black p-4">
                {transaction.sold ? "Yes" : "No"}
              </td>
              <td className="border-2 border-black p-4">
                {transaction.image ? (
                  <img
                    src={transaction.image}
                    alt="Transaction"
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between my-6">
        <p>{`Page No: ${page}`}</p>
        <div className="flex justify-between ">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <p className="mx-10">
            -
          </p>
          <button
            disabled={page * 10 >= total}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
        <p>Per Page: 10</p>
      </div>
    </div>
  );
};

export default TransactionsTable;
