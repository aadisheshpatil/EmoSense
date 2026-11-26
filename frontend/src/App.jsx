import { useEffect, useRef, useState } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Technology from './components/Technology';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LiveEmotion from './components/LiveEmotion';
import VoiceEmotion from './components/VoiceEmotion';
import BodyLanguage from './components/BodyLanguage';

export default function App() {
  const [backendStatus, setBackendStatus] = useState('Connecting...');
  const [serverData, setServerData] = useState(null);

  // Individual modality results
  const [faceResult, setFaceResult] = useState(null);
  const [voiceResult, setVoiceResult] = useState(null);

  // Latest body-language result
  const bodyResultRef = useRef(null);

  // Multimodal fusion result
  const [fusionResult, setFusionResult] = useState(null);

  // Prevent older API responses from replacing newer results
  const fusionRequestRef = useRef(0);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/status')
      .then((response) => {
        if (!response.ok) throw new Error('Connection failed');
        return response.json();
      })
      .then((data) => {
        setServerData(data);
        setBackendStatus('Connected');
      })
      .catch(() => {
        setBackendStatus('Disconnected');
      });
  }, []);

  // Send facial and voice predictions to the fusion API
  useEffect(() => {
    const hasFace =
      faceResult?.face_detected &&
      faceResult?.emotion &&
      faceResult?.confidence !== null;

    const hasVoice =
      voiceResult?.success &&
      voiceResult?.emotion &&
      voiceResult?.confidence !== null;

    if (!hasFace && !hasVoice) {
      fusionRequestRef.current += 1;
      setFusionResult(null);
      return;
    }

    const requestId = ++fusionRequestRef.current;

    async function runFusion() {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/multimodal-fusion',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              face: faceResult,
              voice: voiceResult,
              body: bodyResultRef.current,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Fusion request failed');
        }

        const data = await response.json();

        if (requestId === fusionRequestRef.current) {
          setFusionResult(data);
        }
      } catch (error) {
        console.error('Multimodal fusion error:', error);
      }
    }

    runFusion();
  }, [faceResult, voiceResult]);

  return (
    <>
      <Navbar />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full text-on-surface selection:bg-primary/30 selection:text-white relative overflow-hidden">

          {/* Ambient glow lights */}
          <div className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -z-10" />

          <div className="pointer-events-none absolute top-[30%] -right-40 w-[550px] h-[550px] bg-secondary/10 rounded-full blur-[140px] -z-10" />

          <div className="pointer-events-none absolute top-[65%] left-[-100px] w-[600px] h-[600px] bg-tertiary-container/10 rounded-full blur-[160px] -z-10" />

          {/* Backend Connection Status */}
          <div className="w-full max-w-5xl mx-auto px-margin-mobile md:px-margin py-space-md">
            <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-space-md">

              <div className="flex items-center gap-space-sm">
                <span
                  className={`w-3 h-3 rounded-full ${
                    backendStatus === 'Connected'
                      ? 'bg-green-400'
                      : backendStatus === 'Disconnected'
                      ? 'bg-red-400'
                      : 'bg-yellow-400'
                  }`}
                />

                <span className="font-label-md text-label-md text-on-surface">
                  Backend: {backendStatus}
                </span>
              </div>

              {serverData && (
                <div className="mt-space-sm text-on-surface-variant font-body-sm text-body-sm">
                  <p>Project: {serverData.project}</p>
                  <p>Frontend: {serverData.frontend}</p>
                  <p>Backend: {serverData.backend}</p>
                  <p>{serverData.message}</p>
                </div>
              )}

            </div>
          </div>

          {/* Landing Page Sections */}
          <Hero />
          <About />
          <Features />

          {/* Facial Emotion Recognition */}
          <LiveEmotion onResult={setFaceResult} />

          {/* Voice Emotion Recognition */}
          <VoiceEmotion onResult={setVoiceResult} />

          {/* Body Language Analysis */}
          <BodyLanguage
            onResult={(result) => {
              bodyResultRef.current = result;
            }}
          />

          {/* Multimodal Fusion Status */}
          <section className="w-full max-w-5xl mx-auto px-margin-mobile md:px-margin py-space-md">
            <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-space-md">
              <h2 className="text-xl font-semibold mb-3">
                Multimodal Emotion Fusion
              </h2>

              {fusionResult?.success ? (
                <div>
                  <p>
                    Final Emotion: {fusionResult.final_emotion}
                  </p>

                  <p>
                    Confidence: {fusionResult.confidence}%
                  </p>

                  <p>
                    Modalities Agree: {fusionResult.agreement ? 'Yes' : 'No'}
                  </p>
                </div>
              ) : (
                <p className="text-on-surface-variant">
                  Waiting for facial or voice emotion predictions...
                </p>
              )}
            </div>
          </section>

          <HowItWorks />
          <Technology />
          <CTA />

        </div>
      </main>

      <Footer />
    </>
  );
}