import React, { useState, useRef } from 'react';
import { Card, Form, Button, Dropdown } from 'react-bootstrap';
import Markdown from 'markdown-to-jsx';
import { translateText } from '../../../service/translatorService';

const languageOptions = [
  { label: 'Afrikaans', value: 'af' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Armenian', value: 'hy' },
  { label: 'Assamese', value: 'as' },
  { label: 'Azerbaijani', value: 'az' },
  { label: 'Basque', value: 'eu' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Bosnian', value: 'bs' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Burmese', value: 'my' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Czech', value: 'cs' },
  { label: 'Danish', value: 'da' },
  { label: 'Dutch', value: 'nl' },
  { label: 'English', value: 'en' },
  { label: 'Estonian', value: 'et' },
  { label: 'Farsi', value: 'fa' },
  { label: 'Filipino', value: 'fil' },
  { label: 'Finnish', value: 'fi' },
  { label: 'French', value: 'fr' },
  { label: 'Galician', value: 'gl' },
  { label: 'Georgian', value: 'ka' },
  { label: 'German', value: 'de' },
  { label: 'Greek', value: 'el' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Haitian Creole', value: 'ht' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Hmong', value: 'hmn' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Igbo', value: 'ig' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Irish', value: 'ga' },
  { label: 'Italian', value: 'it' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Javanese', value: 'jv' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Kazakh', value: 'kk' },
  { label: 'Khmer', value: 'km' },
  { label: 'Kinyarwanda', value: 'rw' },
  { label: 'Korean', value: 'ko' },
  { label: 'Kurdish', value: 'ku' },
  { label: 'Kyrgyz', value: 'ky' },
  { label: 'Lao', value: 'lo' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Luxembourgish', value: 'lb' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Malagasy', value: 'mg' },
  { label: 'Malay', value: 'ms' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Maltese', value: 'mt' },
  { label: 'Maori', value: 'mi' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Mongolian', value: 'mn' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Oriya', value: 'or' },
  { label: 'Oromo', value: 'om' },
  { label: 'Pashto', value: 'ps' },
  { label: 'Polish', value: 'pl' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Punjabi', value: 'pa' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Russian', value: 'ru' },
  { label: 'Samoan', value: 'sm' },
  { label: 'Scots Gaelic', value: 'gd' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Sesotho', value: 'st' },
  { label: 'Shona', value: 'sn' },
  { label: 'Sindhi', value: 'sd' },
  { label: 'Sinhala', value: 'si' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Slovenian', value: 'sl' },
  { label: 'Somali', value: 'so' },
  { label: 'Spanish', value: 'es' },
  { label: 'Sundanese', value: 'su' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Tagalog', value: 'tl' },
  { label: 'Tajik', value: 'tg' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Tatar', value: 'tt' },
  { label: 'Telugu', value: 'te' },
  { label: 'Thai', value: 'th' },
  { label: 'Tigrinya', value: 'ti' },
  { label: 'Tongan', value: 'to' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Turkmen', value: 'tk' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Uzbek', value: 'uz' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Welsh', value: 'cy' },
  { label: 'Wolof', value: 'wo' },
  { label: 'Xhosa', value: 'xh' },
  { label: 'Yiddish', value: 'yi' },
  { label: 'Yoruba', value: 'yo' },
  { label: 'Zulu', value: 'zu' },
];

const Translator = () => {
  const [input, setInput] = useState('');
  const [translation, setTranslation] = useState('');
  const [language, setLanguage] = useState('');

  const textareaRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleTranslate = async () => {
    if (!input.trim() || !language) return;

    try {
      const translation = await translateText(input, language);

      setTranslation(translation);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1', paddingRight: '20px' }}>
        <Card>
          <Card.Body>
            <Form.Group controlId="textTranslator">
              <Form.Control
                as="textarea"
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  height: '55vh',
                  width: '100%',
                  resize: 'none',
                  overflow: 'auto',
                }}
                placeholder="Enter text for translation..."
                ref={textareaRef}
                autoFocus
                value={input}
                onChange={handleInputChange}
                rows={10}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="primary"
                  onClick={handleTranslate}
                  style={{ marginTop: '10px', float: 'right' }}
                >
                  Translate Text
                </Button>

              </div>
            </Form.Group>
          </Card.Body>
        </Card>
      </div>
      <Dropdown style={{ marginRight: '15px' }}>
        <Dropdown.Toggle variant="outline-dark" id="dropdown-language">
          {language ? languageOptions.find((option) => option.value === language)?.label : 'Select Language'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {languageOptions.map((option) => (
            <Dropdown.Item
              key={option.value}
              onClick={() => setLanguage(option.value)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div style={{ flex: '1' }}>
        <Card style={{ height: '100%' }}>
          <Card.Body>
            <Markdown>{translation}</Markdown>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Translator;
