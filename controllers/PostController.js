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
};

export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({})
        .populate({path: 'user', select: ['_id', 'fullName', 'email']}).exec();

        res.status(200).json(posts)
    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Can\'t get posts'})
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel
            .findOneAndUpdate({_id: postId}, {$inc: {viewCount: 1}}, {new: true})
            .populate({path: 'user', select: ['_id', 'fullName', 'email']}).exec();

        if (post) {
            return res.status(200).json(post)   
        } else {
            return res.status(404).json({message: 'Post not found'})
        }   
         

    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Can\'t get post'})
    }
};

export const removePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const post = await PostModel.findOneAndDelete({_id: postId, user: userId})

            if (!post) {
                return res.status(404).json({message: 'Post not found'})
            }

            return res.status(200).json({message: 'Post was deleted'})
    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Can\'t remove post'})
    }
};

export const updatePost = async (req, res) => {
    try {
        const {...data} = req.body;

        const postId = req.params.id;
        const post = await PostModel
            .findOneAndUpdate({_id: postId}, {...data}, {new: true})
            .populate({path: 'user', select: ['_id', 'fullName', 'email']}).exec();

        if (post) {
            return res.status(200).json(post)   
        } else {
            return res.status(404).json({message: 'Post not found'})
        }   

    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Can\'t update post'})
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find({}).limit(5).exec();
        const tags = posts.map(item => item.tags).flat().slice(0, 5);

        res.status(200).json(tags)
    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Can\'t GET tags'})
    }
}