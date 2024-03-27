import express from "express"
import { bookRegistration, deleteBook, getAllRegistredBooks, updateBook } from "../controllers/book.controller"
import { verifyJwt } from "../middlewares/authMiddleware"

const routes = express.Router()

routes.use(verifyJwt)
routes.route('/book-registrtation').post(bookRegistration)
routes.route("/getallbooks").get(getAllRegistredBooks)
routes.route('/updatebook').put(updateBook)
routes.route('/deletebook').delete(deleteBook)

export default routes