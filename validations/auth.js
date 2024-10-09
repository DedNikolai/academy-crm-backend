import { body } from 'express-validator';

export {body} from 'express-validator';

export const registerValidation = [
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password to short').isLength({min: 5}),
    body('fullName', 'Invalid FullName').isLength({min: 3}),
    body('avatarUrl', 'Invalid AvatarUrl').optional().isURL()
]