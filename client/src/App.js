import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import TransactionsBarChart from './components/BarChart';
import TransactionsPieChart from './components/PieChart';

const App = () => {
    const [month, setMonth] = useState('03');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    return (
        <div>
            <select value={month} onChange={e => setMonth(e.target.value)}>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions" />
            <TransactionsTable month={month} search={search} page={page} setPage={setPage} />
            <Statistics month={month} search={search} page={page} setPage={setPage} />
            <TransactionsBarChart month={month} search={search} page={page} setPage={setPage} />
            <TransactionsPieChart month={month} search={search} page={page} setPage={setPage} />
        </div>
    );
};

export default App;
