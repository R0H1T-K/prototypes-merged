import axios from 'axios';

export const checkGrammar = async (input) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
  if (!input.trim()) return { errors: [] };

  const systemContent = `**Task:** Your goal is to list the spelling, grammar, and punctuation errors.
  \n\n**Format:** {"errors":[{"error":"error word","correction":"correction word","error_type":"error type"}]}`;

  const message = [
    {
      role: 'system',
      content: systemContent,
    },
    { role: 'user', content: input },
  ];

  try {
    const response = await axios.post(`${API_BASE_URL}/grammar`, {
      message,
    });

    return response.data.reply !== '{}' ? JSON.parse(response.data.reply) : { errors: [] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
