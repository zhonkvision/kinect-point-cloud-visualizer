
import { useEffect, useRef } from 'react';

const SpaceAmbience = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const setupAudio = async () => {
      audioContextRef.current = new AudioContext();
      const ctx = audioContextRef.current;

      // Create reverb and delay effects
      const reverb = ctx.createConvolver();
      const delay = ctx.createDelay(1.0);
      const delayGain = ctx.createGain();
      
      // Setup delay
      delay.delayTime.value = 0.75;
      delayGain.gain.value = 0.3;

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
        const notes = [41.20, 36.71, 49.00, 55.00]; // E1, D2, G1, A1
        
        osc.type = 'sine';
        osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
        gainNode.gain.value = 0.2;

        osc.connect(gainNode);
        gainNode.connect(reverb);
        reverb.connect(ctx.destination);

        osc.start();
        setTimeout(() => {
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 12);
          setTimeout(() => osc.stop(), 12000);
        }, 100);
      };

      // Alien signal beeps
      const createBeep = () => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const panner = ctx.createStereoPanner();
        
        osc.type = 'sine';
        osc.frequency.value = [80, 100, 120][Math.floor(Math.random() * 3)];
        gainNode.gain.value = 0.1;
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

      // Start the loops
      isPlayingRef.current = true;
      
      const droneInterval = setInterval(() => {
        if (isPlayingRef.current) createDrone();
      }, 12000);

      const beepInterval = setInterval(() => {
        if (isPlayingRef.current) createBeep();
      }, 1000 + Math.random() * 500);

      // Initial sounds
      createDrone();
      createBeep();

      // Cleanup
      return () => {
        isPlayingRef.current = false;
        clearInterval(droneInterval);
        clearInterval(beepInterval);
        ctx.close();
      };
    };

    setupAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      isPlayingRef.current = false;
    };
  }, []);

  return null;
};

export default SpaceAmbience;
