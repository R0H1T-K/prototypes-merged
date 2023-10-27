import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Container, Form, FormControl, ProgressBar } from "react-bootstrap";
import { transcribeVideo } from "../service/videoToTextService";


const VideoToText = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);
  const [subtitles, setSubtitles] = useState('');
  // const apikey = process.env.REACT_APP_OPEN_API_KEY;
  const apikey = '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';
  const videoPlayerRef = useRef(null);
  const [responseFormat, setResponseFormat] = useState('vtt');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds the maximum allowed size of 25MB.');
        event.target.value = null;
      } else {
        // Reset state here
        setTranscription('');
        setSubtitles('');
        setVideoFile(file);

        if (videoPlayerRef.current) {
          videoPlayerRef.current.pause();
          videoPlayerRef.current.currentTime = 0;
        }
      }
    }
  };

  const TranscribeVideo = async () => {
    setLoading(true);
    try {
      const response = await transcribeVideo(videoFile, responseFormat, apikey);

      setTranscription(response);
      setResponseReceived(true);
    } catch (error) {
      console.error('Error transcribing video:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTranscription = () => {
    const blob = new Blob([transcription], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoFile.name}.${responseFormat}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (videoPlayerRef.current && transcription) {
      const videoElement = videoPlayerRef.current;
      const timeUpdateListener = () => {
        const currentTime = videoElement.currentTime;
  
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
  
      videoElement.addEventListener('timeupdate', timeUpdateListener);
  
      return () => {
        // Clean up the event listener when the component unmounts
        videoElement.removeEventListener('timeupdate', timeUpdateListener);
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
    <Container style={{ display: 'flex' }}>
      <Card style={{ width: '50%', minHeight: '48.4vw', height: '100vh' }}>
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
              label="Choose Video File"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
            />
          </Form>
          {loading ? (
            <ProgressBar animated now={100} style={{height:40, marginLeft: '1rem'}} label="Transcribing..." />
          ) : (
            <Button
              variant="outline-primary"
              onClick={TranscribeVideo}
              disabled={!videoFile || loading}
              style={{ marginLeft: '1rem' }}
            >
              Generate
            </Button>
          )}
        </div>
        {responseReceived && (
            <div>
              <Button
                variant="success"
                onClick={downloadTranscription}
                style={{ marginLeft: '5rem' }}
              >
                Download
              </Button>
            </div>
          )}
        <div>
          {videoFile && (
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
              <video ref={videoPlayerRef} controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <source src={URL.createObjectURL(videoFile)} />
              </video>

              {responseReceived && subtitles && (
              <div
                style={{
                  backgroundColor: 'black',
                  padding: '1px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  background: 'white',
                }}
              >
                <pre style={{ color: 'black' }}>{subtitles}</pre>
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
            <li>Select your Video file by clicking the "Choose File" button.</li>
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

export default VideoToText;
