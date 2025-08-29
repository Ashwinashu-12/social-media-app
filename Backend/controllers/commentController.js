import Post from '../models/Post.js';

export const addComment = async (req, res) => {
  const { postId, text } = req.body;

  console.log('➡️ Incoming comment body:', req.body);
  console.log('➡️ From user:', req.user?._id);

  if (!postId || !text) {
    return res.status(400).json({ message: 'Missing postId or comment text' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text,
      author: req.user._id,
    };

    post.comments.push(newComment);
    await post.save();

    console.log('✅ Comment added:', newComment);

    res.status(201).json(post);
  } catch (error) {
    console.error('🔥 Error in addComment:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('comments.author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post.comments);
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
