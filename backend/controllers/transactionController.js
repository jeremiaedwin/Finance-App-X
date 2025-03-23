const fs = require('fs');
const path = require('path');
const helper = require('../helpers/helper')

const transactionAll = async (req, res) => {
    // Read the data from the source
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactionsData;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactionsData = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    let transactions = Object.entries(transactionsData).map(([order_id, details]) => ({
        order_id,
        name: details.product.name,
        sku: details.product.sku,
        amount: details.payment.amount,
        method: details.payment.method,
        transaction_status: details.detail?.transaction_status || "unknown",
        transaction_time: helper.formatTimestamp(details.time?.timestamp) || null,
    }));

    if (req.query.transaction_status) {
        transactions = transactions.filter(
            (t) => t.transaction_status === req.query.transaction_status
        );
    }
    if (req.query.method) {
        transactions = transactions.filter(
            (t) => t.method === req.query.method
        );
    }
    if (req.query.date) {
        const filterDate = req.query.date; 
        transactions = transactions.filter((t) => {
            if (!t.transaction_time) return false; 
            const transactionDate = t.transaction_time.split(" ")[0]; 
            return transactionDate === filterDate;
        });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const paginatedData = transactions.slice(startIndex, startIndex + limit);

    res.json({
        total: transactions.length,
        page,
        limit,
        data: paginatedData,
    });

}

const transactionDetail = async (req, res) => {
    const { order_id } = req.params;

    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactionsData;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactionsData = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (transactionsData[order_id]) {
        res.json({data: transactionsData[order_id]}); 
    } else {
        res.status(404).json({ message: "Transaction not found" });
    }
}

module.exports = {
    transactionAll,
    transactionDetail
}