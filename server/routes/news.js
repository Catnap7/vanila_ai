const express = require('express');
const router = express.Router();
const News = require('../models/News');

// 모든 뉴스 가져오기
router.get('/', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 특정 뉴스 가져오기
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다' });
    }
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 새 뉴스 추가
router.post('/', async (req, res) => {
  const news = new News({
    title: req.body.title,
    date: req.body.date,
    source: req.body.source,
    image: req.body.image,
    excerpt: req.body.excerpt,
    content: req.body.content,
    tags: req.body.tags
  });

  try {
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 뉴스 업데이트
router.patch('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다' });
    }

    if (req.body.title) news.title = req.body.title;
    if (req.body.date) news.date = req.body.date;
    if (req.body.source) news.source = req.body.source;
    if (req.body.image) news.image = req.body.image;
    if (req.body.excerpt) news.excerpt = req.body.excerpt;
    if (req.body.content) news.content = req.body.content;
    if (req.body.tags) news.tags = req.body.tags;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 뉴스 삭제
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다' });
    }

    await news.deleteOne();
    res.json({ message: '뉴스가 삭제되었습니다' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
