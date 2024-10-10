import {body} from 'express-validator';

export const createPostValidation = [
    body('title', 'Invalid title').isLength({min: 3, max: 100}).isString(),
    body('text', 'Invalid text').isLength({min: 10}).isString(),
    body('tags', 'Invalid Tags').optional().isArray(),
    body('imageUrl', 'Invalid image').optional().isString()
]