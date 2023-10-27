import axios from 'axios';

const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;

export const generateImage = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    } else {
      console.error('Failed to generate image.');
      throw new Error('Failed to generate image.');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
