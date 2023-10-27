require('dotenv').config()
const express = require('express');
const path = require('path');
const router = require("../pdfVariable/routers/router");
const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs');
const url = "https://api.segmind.com/v1/sdxl1.0-txt2img";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [];
const careerGuidancePrompt = `
**Task:** Act as a career counsellor for students in India.
**Topic:** Help students decide which stream they should take after 10th.
**Style:** Descriptive
**Tone:** Encouraging
**Audience:** Teenager
**Length:** 3 sentences
**Format:** markdown
`;

router.use(express.json());
router.use(express.static(path.join(__dirname, 'buildAI')));

router.post('/ai/clear-conversation', (req, res) => {
  try {
    conversationHistory = [];
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ai/generate', async (req, res) => {
  console.log('aloha');
  try {
    const { input } = req.body;
    const hasCareerGuidancePrompt = conversationHistory.some(
      (message) => message.role === 'system' && message.content === careerGuidancePrompt
    );

    if (!hasCareerGuidancePrompt) {
      conversationHistory.push({ role: 'system', content: careerGuidancePrompt });
    }

    conversationHistory.push({ role: 'user', content: input });

    const response = await openai.chat.completions.create({
      messages: conversationHistory,
      model: 'gpt-3.5-turbo',
    });

    const botReply = response.choices[0]?.message?.content || 'No reply';

    conversationHistory.push({ role: 'assistant', content: botReply });

    res.json({ reply: botReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ai/paraphrase', async (req, res) => {
  try {
    const { message } = req.body;
    console.log(message);
    const response = await openai.chat.completions.create({
      messages: message,
      model: 'gpt-3.5-turbo',
      temperature: 0.1
    });
    res.json({ reply: response.choices[0]?.message?.content, respnse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/ai/grammar', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      messages: message,
      model: 'gpt-3.5-turbo',
      temperature: 0.2
    });
    res.json({ reply: response.choices[0]?.message?.content, respnse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ai/summarize', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      messages: message,
      model: 'gpt-3.5-turbo',
      temperature: 0.8
    });
    console.log(response);
    res.json({ reply: response.choices[0]?.message?.content, respnse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/ai/translate', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      messages: message,
      model: 'gpt-3.5-turbo',
      temperature: 0.5
    });
    console.log(response);
    res.json({ reply: response.choices[0]?.message?.content, respnse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ai/cowrite', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      messages: message,
      model: 'gpt-3.5-turbo',
      temperature: 0.2
    });
    console.log(response);
    res.json({ reply: response.choices[0]?.message?.content, respnse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ai/title', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      messages: message,
      model: 'gpt-3.5-turbo',
      temperature: 1
    });
    console.log(response);
    res.json({ reply: response.choices[0]?.message?.content, respnse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ai/generate-image', async (req, res) => {

  const data = {
    "prompt": req.body.prompt,
    "negative_prompt": "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, blurry, bad anatomy, blurred, watermark, grainy, signature, cut off, draft",
    "style": "base",
    "samples": 1,
    "scheduler": "UniPC",
    "num_inference_steps": 25,
    "guidance_scale": 8,
    "strength": 0.2,
    "seed": -1,
    "img_width": 1024,
    "img_height": 1024,
    "refiner": true,
    "high_noise_fraction": 0.8,
    "base64": false
  };


  try {
    const response = await axios.post(url, data, { headers: { 'x-api-key': process.env.SEGMIND_API_KEY }, responseType: 'arraybuffer' });
    console.log(req.body.prompt);

    console.log(response);

    const timestamp = new Date().getTime();
    const imageName = `image_${timestamp}.jpg`;
    const imagePath = `public/${imageName}`;
    fs.writeFileSync(imagePath, response.data);

    console.log('Image saved successfully to', imagePath);

    const imageUrl = `${process.env.SERVER}/${imageName}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
