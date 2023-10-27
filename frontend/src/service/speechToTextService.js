import axios from 'axios';

export const transcribeAudio = async (audioFile, responseFormat, apikey) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('response_format', responseFormat);
    formData.append('no_speech_threshold', 0.6);

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${apikey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
