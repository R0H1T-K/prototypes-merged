import axios from 'axios';

//const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
const API_BASE_URL = `${'http://localhost:6974/'}ai`;

export const clearConversation = async () => {
  try {
    await axios.post(`${API_BASE_URL}/clear-conversation`);
  } catch (error) {
    console.error(error);
  }
};

export const sendMessage = async (input) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate`, {
      input,
    });
    return response.data.reply;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


