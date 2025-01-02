const fs = require('fs')

const books = JSON.parse(fs.readFileSync('datas/books.json'))


/**
 * Middleware function to validate the `id` parameter.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {function} next - The next middleware function
 * @param {string} id - The `id` parameter
 */
exports.checkID = (req, res, next, id) => {
    if (isNaN(id)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    const book = books.find((b) => b.id === +id);

    if (!book) {
        return res.status(404).json({
            status: 'fail',
            message: `No book found with ID: ${id}`,
        });
    }

    req.params.book = book;

    next();
};
/**
         * This middleware function validates the request body to ensure it contains
         * both the book title and author. If either is missing, it responds with a 
         * 400 status and an error message. Otherwise, it calls the next middleware 
         * function.
         * 
         * @param {Object} req - The request object
         * @param {Object} res - The response object
         * @param {function} next - The next middleware function
         */
exports.validateBody = (req, res, next) => {
    if (!req.body.title || !req.body.author) {

        return res.status(400).json({
            status: "fail",
            message: "the body should contain book title and author"
        })
    }
    next()
}

/**
 * This function is used to get all books
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * 
 * @returns {Object} - The response object with the book data
 * 
 * If the book is found, it will return a 200 status with the book data
 */
exports.getAllBooks = (req, res) => {
    res.status(200).json({

        status: "success",
        requestedTime: req.requestedTime,
        length: books.length,
        data: books
    })
}



/**
 * This function is used to add a new book
 * book not found
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * 
 * @returns {Object} - The response object with the book data
 * 
 * If there is an error while writing the data to the database, it will return a 400 status with a message of "Error while writing data to database"
 * If the book is added, it will return a 201 status with the book data
 */
exports.addBook = (req, res) => {
    const body = req.body
    const newID = books[books.length - 1].id + 1
    const book = Object.assign({ id: newID }, body)


    books.push(book)
    fs.writeFile('datas/books.json', JSON.stringify(books), (err) => {

        if (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Error while writing data to database"
            })

        }
        res.status(201).json({

            status: "success",
            data: book
        })
    })

}

/**
 * Retrieves a book by its ID.
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * 
 * @returns {Object} - The response object with the book data
 */
exports.getBookById = (req, res) => {
    const { book } = req.params

    res.status(200).json({
        status: 'success',
        data: book
    })
}

exports.updateBook = (req, res) => {




    Object.assign(req.params.book, req.body)
    fs.writeFile('datas/books.json', JSON.stringify(books), (err) => {
        if (err) {
            console.log(err)
            return res.send(400).json({
                status: "fail",
                message: "Error while updating database"
            })
        }
        res.status(200).json({
            status: "success",
            data: req.params.book
        })
    })

}



exports.deleteBook = (req, res) => {

    const index = books.indexOf(req.params.book)

    books.splice(index, 1)
    fs.writeFile('./datas/books.json', JSON.stringify(books), (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Error while writing data to database"
            })
        }
        res.status(200).json({
            status: "success",
            message: `The book with ID: ${req.params.book.id} has been deleted`,
            deletedBook: req.params.book
        })
    })

}



