import axios from 'axios';

export const paraphraseText = async (input, mode, sliderValue) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
  try {
    const wordCount = input.match(/\b[\w'-]+\b/g)?.length || 0;
    const systemContent = `**Task:** Rephrase the text in ${wordCount} words. ${sliderValue === 0
      ? ''
      : sliderValue === 1
        ? 'Use a small amount of synonyms.'
        : sliderValue === 2
          ? 'Use a medium amount of synonyms.'
          : 'Use a high amount of synonyms.'
      }\n\n**Format:** markdown.\n\n**Temperature:** 0.1\n\n**Style:** ${mode === 'formal' ? 'Formal' : mode === 'natural' ? 'Informal' : 'Narrative'
      }`;

    const message = [
      {
        role: 'system',
        content: systemContent,
      },
      { role: 'user', content: input },
    ];

    const response = await axios.post(`${API_BASE_URL}/paraphrase`, {
      message,
    });

    return response.data.reply;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const paraphraseTextInSpanish = async (input, mode, sliderValue) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
  try {
    const wordCount = input.match(/\b[\w'-]+\b/g)?.length || 0;
    const systemContent = `**Tarea:** Reformula el texto en ${wordCount} palabras. ${sliderValue === 0
      ? ''
      : sliderValue === 1
        ? 'Usar pocas sinónimos.'
        : sliderValue === 2
          ? 'Usar una cantidad moderada de sinónimos.'
          : 'Usar una gran cantidad de sinónimos.'
      }\n\n**Formato:** markdown.\n\n**Temperatura:** 0.1\n\n**Estilo:** ${mode === 'formal' ? 'Formal' : mode === 'natural' ? 'Informal' : 'Narrativo'
      }`;

    const message = [
      {
        role: 'system',
        content: systemContent,
      },
      { role: 'user', content: input },
    ];

    const response = await axios.post(`${API_BASE_URL}/paraphrase`, {
      message,
    });

    return response.data.reply;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const paraphraseTextInFrench = async (input, mode, sliderValue) => {
  const API_BASE_URL = `${process.env.API_BASE_URL || 'http://localhost:6974/'}ai`;
  try {
    const wordCount = input.match(/\b[\w'-]+\b/g)?.length || 0;
    const systemContent = `**Tâche:** Réformulez le texte en ${wordCount} mots. ${sliderValue === 0
      ? ''
      : sliderValue === 1
        ? 'Utilisez peu de synonymes.'
        : sliderValue === 2
          ? 'Utilisez un nombre moyen de synonymes.'
          : 'Utilisez un grand nombre de synonymes.'
      }\n\n**Format:** markdown.\n\n**Température:** 0.1\n\n**Style:** ${mode === 'formal' ? 'Formel' : mode === 'natural' ? 'Informel' : 'Narratif'
      }`;

    const message = [
      {
        role: 'system',
        content: systemContent,
      },
      { role: 'user', content: input },
    ];

    const response = await axios.post(`${API_BASE_URL}/paraphrase`, {
      message,
    });

    return response.data.reply;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

