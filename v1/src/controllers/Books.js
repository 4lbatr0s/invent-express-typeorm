import { ApiError, ApiNotFoundError } from '../errors/index.js';
import httpStatus from "http-status";
import BookService from "../services/Book.js";

class BookController {
 
    async create(req, res, next) {
        try {
            const result = await BookService.add(req.body);
            res.status(httpStatus.CREATED).send(result);
        } catch (error) {
            return next(new ApiError(error?.message, error?.statusCode));
        }
    }

    async list(req, res, next) {
        try {
            const result = await BookService.findAll();
            res.status(httpStatus.OK).send(result);
        } catch (error) {
            return next(new ApiError(error?.message, error?.statusCode));
        }
    }

    async find(req, res, next) {
        try {
            const result = await BookService.find(req.params.id);
            if (!result) {
                return next(new ApiNotFoundError('Book not found'));
            }
            res.status(httpStatus.OK).send(result);
        } catch (error) {
            return next(new ApiError(error?.message, error?.statusCode));
        }
    }

    async update(req, res, next) {
        try {
            const result = await BookService.update({ id: req.params.id }, req.body);
            if (!result) {
                return next(new ApiNotFoundError('Book not found'));
            }
            res.status(httpStatus.OK).send(result);
        } catch (error) {
            return next(new ApiError(error?.message, error?.statusCode));
        }
    }

    async remove(req, res, next) {
        try {
            const result = await BookService.delete(req.params.id);
            if (!result) {
                return next(new ApiNotFoundError('Book not found'));
            }
            res.status(httpStatus.OK).send({ message: 'Book successfully deleted' });
        } catch (error) {
            return next(new ApiError(error?.message, error?.statusCode));
        }
    }
}

export default new BookController();
