const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');

router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;
        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);
        res.status(200).send('Database initialized successfully');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
});


router.get('/', async (req, res) => {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const regex = new RegExp(search, 'i'); 
    const monthInt = parseInt(month, 10);

    try {
        const query = {
            $and: [
                { $expr: { $eq: [{ $month: '$dateOfSale' }, monthInt] } },
            ]
        };

        if (search) {
            const regex = new RegExp(search, 'i');
            const priceSearch = parseFloat(search);
        
            if (!isNaN(priceSearch)) {
                query.$and.push({ price: priceSearch });
            } else {
                query.$and.push({
                    $or: [
                        { title: regex },
                        { description: regex }
                    ]
                });
            }
        }

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const count = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, total: count, page: parseInt(page), perPage: parseInt(perPage) });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Error fetching transactions');
    }
});


router.get('/statistics', async (req, res) => {
    const { month, search = '' } = req.query;
    const startMonth = parseInt(month); 
    const regex = new RegExp(search, 'i'); 

    try {

        const totalSales = await Transaction.aggregate([
            {
                $match: {
                    $and: [
                        { $expr: { $eq: [{ $month: '$dateOfSale' }, startMonth] } },
                        { sold: true },
                        {
                            $or: [
                                { title: regex },
                                { description: regex }
                            ]
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$price' },
                    totalSold: { $sum: 1 }
                }
            }
        ]);

        const totalNotSold = await Transaction.countDocuments({
            $and: [
                { $expr: { $eq: [{ $month: '$dateOfSale' }, startMonth] } },
                { sold: false },
                {
                    $or: [
                        { title: regex },
                        { description: regex }
                    ]
                }
            ]
        });

        res.status(200).json({
            totalSales: totalSales[0]?.totalAmount || 0,
            totalSold: totalSales[0]?.totalSold || 0,
            totalNotSold
        });
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
});


router.get('/barchart', async (req, res) => {
    const { month, search = '' } = req.query;
    const startMonth = parseInt(month); 
    const regex = new RegExp(search, 'i'); 

    try {
        const ranges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        const barChartData = await Promise.all(ranges.map(async range => {
            const count = await Transaction.countDocuments({
                $expr: { $eq: [{ $month: '$dateOfSale' }, startMonth] },
                price: { $gte: range.min, $lt: range.max },
                $or: [
                    { title: regex },
                    { description: regex }
                ]
            });
            return { range: range.range, count };
        }));

        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
});




router.get('/piechart', async (req, res) => {
    const { month, search = '' } = req.query;
    const startMonth = parseInt(month); 
    const regex = new RegExp(search, 'i'); 

    try {
        const pieChartData = await Transaction.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: '$dateOfSale' }, startMonth] },
                    $or: [
                        { title: regex },
                        { description: regex }
                    ]
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
});



router.get('/combined', async (req, res) => {
    const { month, search = '' } = req.query;
    const PORT = process.env.PORT || 5000;

    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:${PORT}/api/transactions/statistics`, { params: { month, search } }),
            axios.get(`http://localhost:${PORT}/api/transactions/barchart`, { params: { month, search } }),
            axios.get(`http://localhost:${PORT}/api/transactions/piechart`, { params: { month, search } })
        ]);

        res.status(200).json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
});


module.exports = router;
