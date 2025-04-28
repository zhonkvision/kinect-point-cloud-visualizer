
import { useEffect, useRef } from 'react';

const SpaceAmbience = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const setupAudio = async () => {
      audioContextRef.current = new AudioContext();
      (window as any).globalAudioContext = audioContextRef.current;
      const ctx = audioContextRef.current;

      // Create reverb and delay effects
      const reverb = ctx.createConvolver();
      const delay = ctx.createDelay(1.0);
      const delayGain = ctx.createGain();
      
      // Setup delay
      delay.delayTime.value = 0.75;
      delayGain.gain.value = 0.3;

      // Create white noise
      const createWhiteNoise = () => {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.015; // Very quiet white noise
        
        whiteNoise.connect(noiseGain);
        noiseGain.connect(reverb);
        whiteNoise.start();
      };

      // Create impulse response for reverb
      const length = ctx.sampleRate * 3.0;
      const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
      for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length / 3));
        }
      }
      reverb.buffer = impulse;

      // Space drone function
      const createDrone = () => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const notes = [41.20, 36.71, 49.00, 55.00, 82.40, 73.42];
        
        osc.type = 'sine';
        osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
        gainNode.gain.value = 0.15;

        osc.connect(gainNode);
        gainNode.connect(reverb);
        reverb.connect(ctx.destination);

        osc.start();
        setTimeout(() => {
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 12);
          setTimeout(() => osc.stop(), 12000);
        }, 100);
      };

      // Alien signal beeps with enhanced spatial movement
      const createBeep = () => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const panner = ctx.createStereoPanner();
        
        osc.type = 'sine';
        osc.frequency.value = [80, 100, 120, 160, 200][Math.floor(Math.random() * 5)];
        gainNode.gain.value = 0.08;
        panner.pan.value = Math.random() * 2 - 1;

        osc.connect(gainNode);
        gainNode.connect(panner);
        panner.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(ctx.destination);
        panner.connect(ctx.destination);

        osc.start();
        setTimeout(() => {
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
          setTimeout(() => osc.stop(), 1000);
        }, 100);
      };

      // Start all audio elements
      isPlayingRef.current = true;
      
      createWhiteNoise(); // Start the white noise
      
      const droneInterval = setInterval(() => {
        if (isPlayingRef.current) createDrone();
      }, 12000);

      const beepInterval = setInterval(() => {
        if (isPlayingRef.current) createBeep();
      }, 1000 + Math.random() * 500);

      // Initial sounds
      createDrone();
      createBeep();

      return () => {
        isPlayingRef.current = false;
        clearInterval(droneInterval);
        clearInterval(beepInterval);
        ctx.close();
        (window as any).globalAudioContext = null;
      };
    };

    setupAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        (window as any).globalAudioContext = null;
      }
      isPlayingRef.current = false;
    };
  }, []);

  return null;
};

export default SpaceAmbience;
