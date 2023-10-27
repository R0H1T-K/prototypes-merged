import axios from 'axios';

export const translateText = async (input, targetLanguage) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
  try {
    const systemContent = `**Task:** Translate into text into ${targetLanguage}.\n\n**Format:** markdown`;
    const message = [
      {
        role: 'system',
        content: systemContent,
      },
      { role: 'user', content: input },
    ];

    const response = await axios.post(`${API_BASE_URL}/translate`, {
      message,
    });


    return response.data.reply || '';
  } catch (error) {
    console.error(error);
    throw error;
  }
};
