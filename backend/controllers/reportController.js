const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const helper = require('../helpers/helper')

const generateReport = async (req, res) => {
    try {
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

        const transactionAll = processAllTransactionData(transactions, month, year)
        const transactionOverview = processOverviewData(transactions, month, year)
        const transactionStatus = processStatusData(transactions, month, year)
        const transactionMethod = processMethodData(transactions, month, year)
        const transactionProduct = processProductData(transactions, month, year)
        const transactionDevice = processIncomePerDeviceData(transactions, month, year)
        

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let statusRows = Object.entries(transactionStatus.statusCounts)
        .map(([status, count]) => `
            <tr>
                <td width="40%">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
                <td width="1%"> : </td>
                <td>${count}</td>
            </tr>
        `)
        .join("");

        let methodRows = Object.entries(transactionMethod.methodCounts)
        .map(([method, count]) => `
            <tr>
                <td width="40%">${method.charAt(0).toUpperCase() + method.slice(1)}</td>
                <td width="1%"> : </td>
                <td>${count}</td>
            </tr>
        `)
        .join("");

        let nameRows = Object.entries(transactionProduct.nameCounts)
        .map(([name, count]) => `
            <tr>
                <td width="40%">${name.charAt(0).toUpperCase() + name.slice(1)}</td>
                <td width="1%"> : </td>
                <td>${count}</td>
            </tr>
        `)
        .join("");

        let deviceIncomeRows = Object.entries(transactionDevice.deviceIncome)
        .map(([name, count]) => `
            <tr>
                <td width="40%">${name.charAt(0).toUpperCase() + name.slice(1)}</td>
                <td width="1%"> : </td>
                <td>${count}</td>
            </tr>
        `)
        .join("");

        let transactionRows = transactionAll.map(transaction => `
            <tr>
                <td>${transaction.order_id}</td>
                <td>${transaction.name}</td>
                <td>${transaction.sku}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.nett}</td>
                <td>${transaction.method}</td>
                <td>${transaction.transaction_status}</td>
                <td>${transaction.transaction_time}</td>
            </tr>
        `).join("");

        const htmlContent = `
            <html>
                <head><title>PDF Export</title></head>
                <body>
                    <center><h1>Financial Report</h1></center>
                    <center><p>For Month: ${month} ${year}</p></center>
                    <hr>
                    <h2>Financial Overview</h2>
                    <table border="1" width="100%">
                            <tr>
                                <td width="40%">Total transaction</td>
                                <td width="1%" > : </td>
                                <td>${transactionOverview['Total Transaction']}</td>
                            </tr>
                            <tr>
                                <td width="40%">Total Income</td>
                                <td> : </td>
                                <td>${transactionOverview['Total Income']}</td>
                            </tr>
                            <tr>
                                <td width="40%">Total Net Income</td>
                                <td> : </td>
                                <td>${transactionOverview['Total Net Income']}</td>
                            </tr>
                    </table>

                    <h2>Transaction Status</h2>
                    <table border="1" width="100%">
                            ${statusRows}
                    </table>

                    <h2>Transaction Method</h2>
                    <table border="1" width="100%">
                            ${methodRows}
                    </table>

                    <h2>Product Purchased</h2>
                    <table border="1" width="100%">
                            ${nameRows}
                    </table>

                    <h2>Income Per Devices</h2>
                    <table border="1" width="100%">
                            ${deviceIncomeRows}
                    </table>

                    <h2>Detail Transaction</h2>
                    <table border="1" width="100%">
                        <thead>
                            <th>Order ID</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Amount</th>
                            <th>Fee</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Order Time</th>
                        </thead>
                        <tbody>
                            ${transactionRows}
                        </tbody>
                    </table>


                </body>
            </html>
        `;

        // Set the page content
        await page.setContent(htmlContent);

        // Generate PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });

        // Close the browser
        await browser.close();

        // Send the PDF as a response
        res.setHeader('Content-Disposition', 'attachment; filename="export.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
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
        "Total Transaction": countTransaction,
        "Total Income": totalIncome,
        "Total Net Income": totalNetIncome
    };
};

const processStatusData = (transactions, month, year) => {
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

const processMethodData = (transactions, month, year) => {
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

const processProductData = (transactions, month, year) => {
    let nameCounts = {};

    Object.values(transactions).forEach(({ product, detail, payment, time }) => {
        const date = new Date(time.timestamp);

        // Filter by month and year
        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            let name = product?.name && product.name.trim() !== '' ? product.name : 'other name';

            name = String(name);

            if (name) {
                nameCounts[name] = (nameCounts[name] || 0) + 1;
            }
        }
    });

    return {
        nameCounts
    };
};

const processIncomePerDeviceData = (transactions, month, year) => {
    let deviceIncome = {};

    Object.values(transactions).forEach(({ product, detail, payment, time }) => {
        const date = new Date(time.timestamp);

        // Filter by month and year
        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            let device_id = product?.device_id && product.device_id.trim() !== '' ? product.device_id : 'other device_id';

            device_id = String(device_id);

            if (device_id) {
                deviceIncome[device_id] = (deviceIncome[device_id] || 0) + payment.amount;
            }
        }
    });

    return {
        deviceIncome
    };
};

const processAllTransactionData = (transactions, month, year) => {
    let transactionsData = [];

    Object.entries(transactions).forEach(([order_id, { product, detail, payment, time }]) => {

        const date = new Date(time.firestore_timestamp._seconds * 1000);

        if (
            (!month || date.getMonth() + 1 === parseInt(month)) &&
            (!year || date.getFullYear() === parseInt(year))
        ) {
            transactionsData.push({
                order_id: order_id, // Using the key as order_id
                name: product.name || "Unknown",
                sku: product.sku || "Unknown",
                amount: payment.amount,
                nett: payment.nett,
                method: payment.method,
                transaction_status: detail?.transaction_status || "unknown",
                transaction_time: helper.formatTimestamp(time?.firestore_timestamp._seconds * 1000) || null,
            });
        }
    });

    return transactionsData;
};


module.exports = {
    generateReport
};