import axios from 'axios';

export const summarizeText = async (input, wordCount) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
  try {
    const systemContent = `**Task:** Your goal is to summarize the text in ${(wordCount / 2.4)} words.
      \n\n**Format:** markdown\n\n**Style:** standard`;

    const message = [
      {
        role: 'system',
        content: systemContent,
      },
      { role: 'user', content: input },
    ];

    const response = await axios.post(`${API_BASE_URL}/summarize`, {
      message,
    });

    return response.data.reply || '';
  } catch (error) {
    console.error(error);
    throw error;
  }
};
