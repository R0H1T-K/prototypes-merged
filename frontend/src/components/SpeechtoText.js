import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Container, Form, FormControl, InputGroup, ProgressBar } from "react-bootstrap";
import { transcribeAudio } from '../service/speechToTextService';

const SpeechToText = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);
  const [subtitles, setSubtitles] = useState('');
  const [responseFormat, setResponseFormat] = useState('vtt');
  const audioPlayerRef = useRef(null);
  const apikey = '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'

  // const apikey = process.env.REACT_APP_OPEN_API_KEY;
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);

    if (audioPlayerRef.current && transcription) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }

    setTranscription('');
    setResponseReceived(false);
    setSubtitles('');
  };

  const TranscribeAudio = async () => {
    setLoading(true);
    try {
      const response = await transcribeAudio(audioFile, responseFormat, apikey);
      console.log(response);
      setTranscription(response);

      console.log(response.data);
      setResponseReceived(true);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTranscription = () => {
    const blob = new Blob([transcription], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audioFile.name}.${responseFormat}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (audioPlayerRef.current && transcription) {
      const audioElement = audioPlayerRef.current;
      const timeUpdateListener = () => {
        const currentTime = audioElement.currentTime;
  
        const vttLines = transcription.split('\n');
        let subtitlesText = '';
  
        for (let i = 0; i < vttLines.length; i++) {
          if (vttLines[i].includes('-->')) {
            const [startTime, endTime] = vttLines[i].split('-->');
            const subtitleStartTime = parseVttTime(startTime);
            const subtitleEndTime = parseVttTime(endTime);
  
            if (currentTime >= subtitleStartTime && currentTime <= subtitleEndTime) {
              for (let j = i + 1; j < vttLines.length; j++) {
                if (!vttLines[j].trim()) {
                  break;
                }
                subtitlesText += vttLines[j] + '\n';
              }
              break;
            }
          }
        }
  
        setSubtitles(subtitlesText);
      };
  
      audioElement.addEventListener('timeupdate', timeUpdateListener);
  
      return () => {
        // Clean up the event listener when the component unmounts
        audioElement.removeEventListener('timeupdate', timeUpdateListener);
      };
    }
  }, [transcription]);
  
  

  function parseVttTime(timeString) {
    const [hours, minutes, secondsAndMillis] = timeString.split(':');
    const [seconds, milliseconds] = secondsAndMillis.split('.');
    return (
      parseFloat(hours) * 3600 +
      parseFloat(minutes) * 60 +
      parseFloat(seconds) +
      parseFloat(milliseconds) / 1000
    );
  }

  return (
    <Container style={{ display: 'flex' }} >
      <Card style={{ width: '50%', minHeight: '38.4vw', height: '100vh' }}>
        <div
          style={{
            padding: '1rem',
            display: "flex",
            marginTop: '5rem',
            marginLeft: '3rem'
          }}
        >
          <Form>
            <FormControl
              label="Choose File"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </Form>
          {loading ? (
            <ProgressBar animated now={100} style={{height:40, marginLeft: '1rem'}} label="Transcribing..." />
          ) : (
            <Button
              variant="outline-primary"
              onClick={TranscribeAudio}
              disabled={!audioFile || loading}
              style={{ marginLeft: '1rem' }}
            >
              Generate
            </Button>
          )}
        </div>
        {responseReceived && (
          <div style={{
            padding: '1rem',
            display: "flex",
            marginLeft: '3rem'
          }}>
            <Button
              variant="primary"
              onClick={downloadTranscription}
              style={{ marginLeft: '1rem' }}
            >
              Download
            </Button>
          </div>
        )}
        <div>
          {audioFile && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                height: '60vh',
                margin: '0 auto',
              }}
            >
              <audio ref={audioPlayerRef} controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <source src={URL.createObjectURL(audioFile)} />
              </audio>

              {responseReceived && subtitles && (
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '1px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  <pre style={{ color: 'black', fontSize: '12px' }}>{subtitles}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      <Card style={{ width: '50%', minHeight: '38.4vw', height: '100vh' }}>
        <div
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
          }}
        >
          <h6>How does it work?</h6>
          <ol>
            <li>Select your audio file by clicking the "Choose File" button.</li>
            <li>Click on the "Generate Subtitles" button to start the transcription process.</li>
            <li>Wait for the subtitles to generate. This may take a moment, and a loading indicator will be displayed.</li>
            <li>
              When the "Download" button appears, you can take one of the following actions:
              <ul>
                <li>Play Audio: Play the audio to check the generated subtitles. You can use the audio player controls.</li>
                <li>Download Subtitles: Click the "Download" button to save the subtitles in the chosen format.</li>
              </ul>
            </li>
          </ol>
        </div>
      </Card>
    </Container>
  );
};
export default SpeechToText;