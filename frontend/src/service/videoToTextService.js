import axios from 'axios';

export const transcribeVideo = async (videoFile, responseFormat, apikey) => {
  try {
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('model', 'whisper-1');
    formData.append('word_timestamps', 'True');
    formData.append('response_format', responseFormat);
    
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${apikey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error transcribing video:', error);
    throw error;
  }
};
