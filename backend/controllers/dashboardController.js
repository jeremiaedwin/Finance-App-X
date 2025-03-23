const fs = require('fs');
const path = require('path');
const helper = require('../helpers/helper')

// ======================================================================================= GET TRANSACTION OVERVIEW ================================================================================================
const transactionOverview = async (req, res) => {
    const { month, year } = req.query;

    // Read the data from the source
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactions;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    const overviewData = processOverviewData(transactions, month, year);

    return res.json(overviewData);


}

const processOverviewData = (transactions, month, year) => {
    let countTransaction = 0;
    let totalIncome = 0;
    let totalNetIncome = 0; 

    Object.values(transactions).forEach(({ payment, time }) => {
        const date = new Date(time.timestamp);

        // Filter by month and year
        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            countTransaction += 1;
            totalIncome += payment.amount;
            totalNetIncome += payment.nett;
        }
    });

    return {
        countTransaction,
        totalIncome,
        totalNetIncome
    };
};

// ======================================================================================= GET TRANSACTION STATUS ================================================================================================
const transactionStatus = async (req, res) => {
    const { month, year } = req.query;

    // Read the data from the source
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactions;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    const overviewData = processTransactionStatusData(transactions, month, year);

    return res.json(overviewData);


}

const processTransactionStatusData = (transactions, month, year) => {
    let statusCounts = {};

    Object.values(transactions).forEach(({ detail, payment, time }) => {
        const date = new Date(time.timestamp);

        // Filter by month and year
        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            // Extract transaction status from `detail` or `payment.detail`
            let status = detail?.transaction_status || payment?.detail?.transaction_status;

            if (status) {
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            }
        }
    });

    return {
        statusCounts
    };
};

// ======================================================================================= GET TRANSACTION METHOD ================================================================================================
const transactionMethod = async (req, res) => {
    const { month, year } = req.query;

    // Read the data from the source
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactions;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    const overviewData = processTransactionMethodData(transactions, month, year);

    return res.json(overviewData);


}

const processTransactionMethodData = (transactions, month, year) => {
    let methodCounts = {};

    Object.values(transactions).forEach(({ detail, payment, time }) => {
        const date = new Date(time.timestamp);

        // Filter by month and year
        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            let method = payment?.method && payment.method.trim() !== '' ? payment.method : 'other method';

            method = String(method);

            if (method) {
                methodCounts[method] = (methodCounts[method] || 0) + 1;
            }
        }
    });

    return {
        methodCounts
    };
};


// ================================================================================= GET REVENUE GROWTH FOR THE LINE CHART =========================================================================================
const revenueGrowthChart = async (req, res) => {

    const { month, year } = req.query;

    // Read the data from the source
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactions;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


    const revenueData = processRevenueData(transactions, month, year);

    res.json(revenueData);
}

// Function to filter and process revenue data
const processRevenueData = (transactions, month, year) => {
    let revenueMap = {};

    Object.values(transactions).forEach(({ payment, time }) => {
        const date = new Date(time.timestamp);
        const formattedDate = helper.formatDate(time.timestamp);


        // Filter by month and year
        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            revenueMap[formattedDate] = (revenueMap[formattedDate] || 0) + payment.amount;
        }
    });

    return Object.entries(revenueMap)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, revenue]) => ({ x: date, y: revenue }));
};

// ========================================================================== GET PAYMENT METHOD FEE FOR THE BAR CHART =========================================================================================
const paymentMethodFeeRankChart = async (req, res) => {

    const { month, year } = req.query;

    // Read the data from the source
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactions;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


    const revenueData = paymentMethodFeeData(transactions, month, year);

    res.json(revenueData);
}

const paymentMethodFeeData = (transactions, month, year) => {
    let paymentFeeMap = {};

    Object.values(transactions).forEach(({ payment, time }) => {
        const date = new Date(time.timestamp);


        // Filter by month and year
        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            if (!payment || !payment.method || !payment.fee) return;

            const method = payment.method;
            const totalFee = Object.values(payment.fee).reduce((sum, fee) => sum + fee, 0);

            paymentFeeMap[method] = (paymentFeeMap[method] || 0) + totalFee;
        }
    });

    return Object.entries(paymentFeeMap)
        .sort(([, feeA], [, feeB]) => feeB - feeA) 
        .map(([method, fee]) => ({ x: method, y: fee }));
};

// ========================================================================== GET PAYMENT METHOD FEE FOR THE BAR CHART =========================================================================================
const productRankChart = async (req, res) => {

    const { month, year } = req.query;

    // Read the data from the source
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../data/transaction.json'); // Adjust path as needed
    let transactions;

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        transactions = JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions.json:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


    const productRevenueData = productRevenueRankData(transactions, month, year);

    res.json(productRevenueData);
}

const productRevenueRankData = (transactions, month, year) => {
    let productRevenueMap = {};
    const monthNum = month ? parseInt(month, 10) : null;
    const yearNum = year ? parseInt(year, 10) : null;

    Object.values(transactions).forEach(({ product, detail, payment, time }) => {
        const date = new Date(time.timestamp);

        // Filter by month and year
        if (
            (!monthNum || date.getMonth() + 1 === monthNum) &&
            (!yearNum || date.getFullYear() === yearNum)
        ) {
            if (!payment || !payment.method || !payment.amount) return;
            if (!detail || detail.transaction_status !== "settlement") return;

            const productName = product.name;
            const amount = payment.amount; // Fixing the incorrect usage of Object.values()

            productRevenueMap[productName] = (productRevenueMap[productName] || 0) + amount;
        }
    });

    return Object.entries(productRevenueMap)
        .sort(([, amountA], [, amountB]) => amountB - amountA) // Sort by highest revenue
        .map(([product, amount]) => ({ x: product, y: amount }));
};


module.exports = {
    revenueGrowthChart,
    transactionOverview,
    transactionStatus,
    transactionMethod,
    paymentMethodFeeRankChart,
    productRankChart
}