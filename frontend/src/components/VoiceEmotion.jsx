import { useEffect, useRef, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/api/voice-emotion';

function encodeWav(chunks, sampleRate) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const samples = new Float32Array(length);

  let offset = 0;

  chunks.forEach((chunk) => {
    samples.set(chunk, offset);
    offset += chunk.length;
  });

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(position, value) {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(position + i, value.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let position = 44;

  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const value = sample < 0
      ? sample * 32768
      : sample * 32767;

    view.setInt16(position, value, true);
    position += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export default function VoiceEmotion({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const streamRef = useRef(null);
  const contextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const busyRef = useRef(false);

  function releaseMicrophone() {
    clearTimeout(timerRef.current);

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (contextRef.current) {
      const context = contextRef.current;
      contextRef.current = null;

      if (context.state !== 'closed') {
        context.close().catch(() => {});
      }
    }
  }

  async function startRecording() {
  if (onResult) {
    onResult(null);
  }
    try {
      setError('');
      setResult(null);
      setRecordingTime(0);
      chunksRef.current = [];

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone access is not supported by this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log('MICROPHONE TRACK:', stream.getAudioTracks().map(track => ({
  label: track.label,
  enabled: track.enabled,
  muted: track.muted,
  readyState: track.readyState,
  settings: track.getSettings(),
})));

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      const audioContext = new AudioContextClass();
      contextRef.current = audioContext;

      await audioContext.resume();

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      await audioContext.audioWorklet.addModule(
  new URL('./audioProcessor.js', import.meta.url)
);

const processor = new AudioWorkletNode(
  audioContext,
  'audio-capture-processor'
);

processorRef.current = processor;

processor.port.onmessage = (event) => {
  chunksRef.current.push(event.data);
};

const gain = audioContext.createGain();
gain.gain.value = 0;
gainRef.current = gain;

source.connect(processor);
processor.connect(gain);
gain.connect(audioContext.destination);

      startTimeRef.current = Date.now();
      setRecording(true);

      timerRef.current = setTimeout(() => {
        stopAndAnalyze();
      }, 8000);

    } catch (err) {
      releaseMicrophone();
      setRecording(false);

      setError(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access.'
          : err.message || 'Unable to access the microphone.'
      );
    }
  }

  async function stopAndAnalyze() {
    if (busyRef.current || !contextRef.current) return;

    busyRef.current = true;

    const duration = (Date.now() - startTimeRef.current) / 1000;
    const sampleRate = contextRef.current.sampleRate;
    const chunks = [...chunksRef.current];

    setRecording(false);
    setRecordingTime(duration);

    releaseMicrophone();

    if (duration < 0.5 || chunks.length === 0) {
      setError('Recording is too short. Please record for at least 1 second.');
      busyRef.current = false;
      return;
    }

    try {
      setAnalyzing(true);
      setError('');

      let peak = 0;
let sumSquares = 0;
let totalSamples = 0;

chunks.forEach((chunk) => {
  for (let i = 0; i < chunk.length; i++) {
    const value = Math.abs(chunk[i]);

    peak = Math.max(peak, value);
    sumSquares += chunk[i] * chunk[i];
    totalSamples++;
  }
});

const rms = Math.sqrt(sumSquares / totalSamples);

console.log('VOICE AUDIO DIAGNOSTICS:', {
  peakAmplitude: peak,
  rmsAmplitude: rms,
  sampleRate,
  duration,
});

      const wavBlob = encodeWav(chunks, sampleRate);

      const formData = new FormData();
      formData.append('file', wavBlob, 'voice_recording.wav');

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Voice analysis failed.');
      }

      setResult(data);
      if (onResult) {
  onResult(data);
}

    } catch (err) {
      setError(err.message || 'Unable to analyze voice.');
    } finally {
      setAnalyzing(false);
      busyRef.current = false;
    }
  }

  useEffect(() => {
    return () => {
      releaseMicrophone();
    };
  }, []);

  const emotionEmoji = {
    angry: '😠',
    calm: '😌',
    disgust: '🤢',
    fearful: '😨',
    happy: '😊',
    sad: '😢',
    surprised: '😮',
  };

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-10">
          

          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
            Voice Emotion Recognition
          </h2>

          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Analyze vocal characteristics using AI to identify emotions
            expressed through speech.
          </p>
        </div>

        <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-6 md:p-10">

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              🎙️
            </div>

            <h3 className="text-xl font-semibold text-on-surface mb-2">
              Voice Analysis
            </h3>

            <p className="text-on-surface-variant text-sm">
              Speak naturally into your microphone.
              Recording is limited to 8 seconds.
            </p>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">

            {!recording && (
              <button
                onClick={startRecording}
                disabled={analyzing}
                className="px-7 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                🎤 Start Recording
              </button>
            )}

            {recording && (
              <button
                onClick={stopAndAnalyze}
                className="px-7 py-3 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90"
              >
                ⏹ Stop & Analyze
              </button>
            )}

          </div>

          {recording && (
            <div className="text-center mt-6">
              <p className="text-red-400 font-semibold animate-pulse">
                ● Recording in progress...
              </p>
              <p className="text-on-surface-variant mt-2">
                Maximum recording time: 8 seconds
              </p>
            </div>
          )}

          {analyzing && (
            <div className="text-center mt-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-on-surface font-medium">
                Analyzing your voice...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 rounded-xl bg-surface border border-primary/30 text-center">

              <p className="text-on-surface-variant text-sm mb-3">
                Detected Voice Emotion
              </p>

              <div className="text-6xl mb-3">
                {emotionEmoji[result.emotion] || '🎭'}
              </div>

              <h3 className="text-3xl font-bold text-primary capitalize mb-4">
                {result.emotion}
              </h3>

              <div className="max-w-md mx-auto">

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant">
                    Model Confidence
                  </span>

                  <span className="text-on-surface font-semibold">
                    {result.confidence}%
                  </span>
                </div>

                <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>

                <div className="mt-5 text-sm text-on-surface-variant">
                  <p>Recording duration: {result.duration} seconds</p>
                  <p>Sample rate: {result.sample_rate} Hz</p>
                </div>

              </div>
            </div>
          )}

          <p className="text-xs text-on-surface-variant text-center mt-8">
            Audio is sent to your local EmoSense backend for emotion analysis.
          </p>

        </div>
      </div>
    </section>
  );
}