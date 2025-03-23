const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')

router.route('/all')
    .get(transactionController.transactionAll)

router.route('/:order_id')
    .get(transactionController.transactionDetail)


module.exports = router