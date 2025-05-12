const express = require('express');
const router = express.Router();
const AIModel = require('../models/AIModel');

// 모든 AI 모델 가져오기
router.get('/', async (req, res) => {
  try {
    const aiModels = await AIModel.find();
    res.json(aiModels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 특정 AI 모델 가져오기
router.get('/:id', async (req, res) => {
  try {
    const aiModel = await AIModel.findById(req.params.id);
    if (!aiModel) {
      return res.status(404).json({ message: 'AI 모델을 찾을 수 없습니다' });
    }
    res.json(aiModel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 새 AI 모델 추가
router.post('/', async (req, res) => {
  const aiModel = new AIModel({
    name: req.body.name,
    category: req.body.category,
    company: req.body.company,
    pricing: req.body.pricing,
    features: req.body.features,
    popularity: req.body.popularity,
    releaseDate: req.body.releaseDate,
    image: req.body.image
  });

  try {
    const newAIModel = await aiModel.save();
    res.status(201).json(newAIModel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// AI 모델 업데이트
router.patch('/:id', async (req, res) => {
  try {
    const aiModel = await AIModel.findById(req.params.id);
    if (!aiModel) {
      return res.status(404).json({ message: 'AI 모델을 찾을 수 없습니다' });
    }

    if (req.body.name) aiModel.name = req.body.name;
    if (req.body.category) aiModel.category = req.body.category;
    if (req.body.company) aiModel.company = req.body.company;
    if (req.body.pricing) aiModel.pricing = req.body.pricing;
    if (req.body.features) aiModel.features = req.body.features;
    if (req.body.popularity) aiModel.popularity = req.body.popularity;
    if (req.body.releaseDate) aiModel.releaseDate = req.body.releaseDate;
    if (req.body.image) aiModel.image = req.body.image;

    const updatedAIModel = await aiModel.save();
    res.json(updatedAIModel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// AI 모델 삭제
router.delete('/:id', async (req, res) => {
  try {
    const aiModel = await AIModel.findById(req.params.id);
    if (!aiModel) {
      return res.status(404).json({ message: 'AI 모델을 찾을 수 없습니다' });
    }

    await aiModel.deleteOne();
    res.json({ message: 'AI 모델이 삭제되었습니다' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
