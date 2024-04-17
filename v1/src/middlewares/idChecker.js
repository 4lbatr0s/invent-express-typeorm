import httpStatus from "http-status";
import Messages from "../scripts/utils/messages.js";
import globalErrorHandler from "./error.js";

const idChecker = (...fields) => (req, res, next) => {
    const idFields = fields.length ? fields : ['id']; //if no argument ['id'], if array, return fields. Otherwise return all parameters.
    /**
     * INFO: 
     * Should be a valid UUID format
     */
    for (const field of idFields) {
        if(!req?.params[field]?.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)){
            return next(globalErrorHandler(Messages.ERROR.BAD_ID_FORMAT, httpStatus.BAD_REQUEST));
        }    
    }
    
    return next();
}

export default idChecker;
