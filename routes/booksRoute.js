
const express = require("express")

const bookController = require('./../controller/bookController')

const router = express.Router()

router.param('id', bookController.checkID)
router.route('/')
    .get(bookController.getAllBooks)
    .post(bookController.validateBody, bookController.addBook)

router.route('/:id')
    .get(bookController.getBookById)
    .patch(bookController.updateBook)
    .delete(bookController.deleteBook)

module.exports = router
