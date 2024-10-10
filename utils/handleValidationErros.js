import {validationResult} from 'express-validator';

export default (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json(erros.array())
    } 

    next();
}