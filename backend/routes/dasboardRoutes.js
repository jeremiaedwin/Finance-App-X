const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')

router.route('/revenue-growth-chart')
    .get(dashboardController.revenueGrowthChart)

router.route('/transaction-overview')
    .get(dashboardController.transactionOverview)

router.route('/transaction-status')
    .get(dashboardController.transactionStatus)

router.route('/transaction-method')
    .get(dashboardController.transactionMethod)

router.route('/payment-method-fee-rank')
    .get(dashboardController.paymentMethodFeeRankChart)

router.route('/product-amount-rank')
    .get(dashboardController.productRankChart)

module.exports = router