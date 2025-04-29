
import { useEffect, useRef } from 'react';

const SpaceAmbience = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const setupAudio = async () => {
      audioContextRef.current = new AudioContext();
      (window as any).globalAudioContext = audioContextRef.current;
      const ctx = audioContextRef.current;

      // Create reverb and delay effects with longer decay for therapeutic ambience
      const reverb = ctx.createConvolver();
      const delay = ctx.createDelay(5.0);
      const delayGain = ctx.createGain();
      
      // Setup gentler delay
      delay.delayTime.value = 2.5;
      delayGain.gain.value = 0.2;

      // Create filtered white noise for a gentler ambient sound
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
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 500;
        noiseFilter.Q.value = 0.7;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.01; // Quieter, gentler noise
        
        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(reverb);
        whiteNoise.start();
      };

      // Create calming impulse response for reverb (longer decay)
      const length = ctx.sampleRate * 6.0; // Longer reverb for therapeutic sound
      const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
      for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          // Smoother decay curve for a more calming sound
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5);
        }
      }
      reverb.buffer = impulse;

      // Therapeutic drone function using calming frequency ratios
      const createDrone = () => {
        // Frequencies based on calming ratio intervals
        const baseFrequency = 55.0; // A1 as base
        const frequencies = [
          baseFrequency,              // A1
          baseFrequency * 3/2,        // Perfect fifth (E2)
          baseFrequency * 2,          // Octave (A2)
          baseFrequency * 5/4,        // Major third (C#2)
          baseFrequency * 4/3         // Perfect fourth (D2)
        ];
        
        // Create multiple oscillators for rich texture
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          const panner = ctx.createStereoPanner();
          
          // Choose frequencies from our calming ratios
          osc.type = ['sine', 'triangle'][Math.floor(Math.random() * 2)]; // Gentler waveforms
          osc.frequency.value = frequencies[Math.floor(Math.random() * frequencies.length)];
          
          // Very gentle volume
          oscGain.gain.value = 0.05 + (Math.random() * 0.05); // Between 0.05 and 0.1
          
          // Spatial positioning for immersion
          panner.pan.value = (Math.random() * 2 - 1) * 0.8; // Between -0.8 and 0.8
          
          // Connect the audio graph
          osc.connect(oscGain);
          oscGain.connect(panner);
          panner.connect(reverb);
          reverb.connect(ctx.destination);
          
          // Start oscillator with gentle fade in
          osc.start();
          oscGain.gain.value = 0.001; // Start nearly silent
          oscGain.gain.exponentialRampToValueAtTime(
            0.05 + (Math.random() * 0.05), 
            ctx.currentTime + 5 // 5 second fade in
          );
          
          // Setup gentle fade out
          setTimeout(() => {
            oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 8);
            setTimeout(() => osc.stop(), 8000);
          }, (20 + Math.random() * 10) * 1000); // Between 20-30 seconds
        }
      };

      // Gentle ambient "breath" sounds
      const createBreath = () => {
        const breathFilter = ctx.createBiquadFilter();
        breathFilter.type = 'bandpass';
        breathFilter.frequency.value = 250 + Math.random() * 150;
        breathFilter.Q.value = 1.0;
        
        const breathGain = ctx.createGain();
        breathGain.gain.value = 0.001; // Start silent
        
        // Use noise for breath sound
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const breathNoise = ctx.createBufferSource();
        breathNoise.buffer = noiseBuffer;
        
        // Connect components
        breathNoise.connect(breathFilter);
        breathFilter.connect(breathGain);
        breathGain.connect(reverb);
        reverb.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(ctx.destination);
        
        // Start the breath sound
        breathNoise.start();
        
        // Breath in
        breathGain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 2);
        
        // Breath out
        setTimeout(() => {
          breathGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
          setTimeout(() => breathNoise.stop(), 3000);
        }, 2000);
      };

      // Start all audio elements
      isPlayingRef.current = true;
      
      createWhiteNoise(); // Start the filtered white noise
      
      // Gentle, therapeutic drones at longer intervals
      const droneInterval = setInterval(() => {
        if (isPlayingRef.current) createDrone();
      }, 15000);

      // Breath sounds at natural intervals
      const breathInterval = setInterval(() => {
        if (isPlayingRef.current) createBreath();
      }, 8000 + Math.random() * 4000);

      // Initial sounds
      createDrone();
      setTimeout(() => createBreath(), 2000);

      return () => {
        isPlayingRef.current = false;
        clearInterval(droneInterval);
        clearInterval(breathInterval);
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
