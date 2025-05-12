const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/Community');

// 모든 커뮤니티 게시글 가져오기
router.get('/', async (req, res) => {
  try {
    const posts = await CommunityPost.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 특정 커뮤니티 게시글 가져오기
router.get('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }
    
    // 조회수 증가
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 새 커뮤니티 게시글 추가
router.post('/', async (req, res) => {
  const post = new CommunityPost({
    title: req.body.title,
    author: {
      name: req.body.author.name,
      avatar: req.body.author.avatar,
      userId: req.body.author.userId
    },
    date: req.body.date || new Date().toISOString().split('T')[0],
    content: req.body.content,
    excerpt: req.body.excerpt || req.body.content.substring(0, 150) + '...',
    tags: req.body.tags
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 커뮤니티 게시글 업데이트
router.patch('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }

    if (req.body.title) post.title = req.body.title;
    if (req.body.content) {
      post.content = req.body.content;
      post.excerpt = req.body.excerpt || req.body.content.substring(0, 150) + '...';
    }
    if (req.body.tags) post.tags = req.body.tags;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 커뮤니티 게시글 삭제
router.delete('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }

    await post.deleteOne();
    res.json({ message: '게시글이 삭제되었습니다' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 게시글 좋아요 증가
router.post('/:id/like', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }
    
    post.likes += 1;
    await post.save();
    
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
