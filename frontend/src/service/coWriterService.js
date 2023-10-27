import axios from 'axios';

export const generateTitle = async (input) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
  if (!input.trim()) return '';

  const systemContent = `**Task:** Generate a title for the text in less than five words.\n\n**Format:** markdown`;

  const message = [
    {
      role: 'system',
      content: systemContent,
    },
    { role: 'user', content: input },
  ];

  try {
    const response = await axios.post(`${API_BASE_URL}/title`, {
      message,
    });

    return response.data.reply || '';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateIdeas = async (input) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;

  if (!input.trim()) return { variations: [] };

  const systemContent = `**Task:** Please adopt the role of a writer and produce the next words in three distinct variations (each 50 words long), each offering a unique perspective or style.\n\n**Format:**{"variations":[{"variation":"1","text":""},{"variation":"2","text":""},{"variation":"3","text":""}]}`;

  const message = [
    {
      role: 'system',
      content: systemContent,
    },
    { role: 'user', content: input },
  ];

  try {
    const response = await axios.post(`${API_BASE_URL}/cowrite`, {
      message,
    });

    return response.data.reply ? JSON.parse(response.data.reply) : { variations: [] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateNextText = async (input) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;

  if (!input.trim()) return '';

  const systemContent = `**Task:** Act as a writer and write the next 100 words.\n\n**Format:** markdown`;

  const message = [
    {
      role: 'system',
      content: systemContent,
    },
    { role: 'user', content: input },
  ];

  try {
    const response = await axios.post(`${API_BASE_URL}/cowrite`, {
      message,
    });

    return response.data.reply || '';
  } catch (error) {
    console.error(error);
    throw error;
  }
};
