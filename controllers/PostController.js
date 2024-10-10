import PostModel from '../models/Post.js'

export const createPost = async (req, res) => {
    try {
        const {title, text, tags, imageUrl} = req.body;

        const doc = new PostModel({
            title,
            text,
            tags,
            imageUrl,
            user: req.userId
        })

        const post = await doc.save();

        if (post) {
            return res.status(200).json(post)
        }
    } catch(error) {
        console.log(error);
        res.status(400).json({message: 'Post wasn\'t created'})
    }
}