import React from 'react';

const resolveVoices = () => {
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    }

    const onVoicesChanged = () => {
      speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(speechSynthesis.getVoices());
    };

    speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
  });
};

const speak = (text: string, voice?: SpeechSynthesisVoice) => {
  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);

    const onEnd = () => {
      utterance.removeEventListener('end', onEnd);
      resolve();
    };

    utterance.addEventListener('end', onEnd);

    if (voice) {
      utterance.voice = voice;
    }

    speechSynthesis.speak(utterance);
  });
};

const useSpeech = () => {
  const isClientSide = typeof window !== 'undefined';
  const [voice, setVoice] = React.useState<SpeechSynthesisVoice>();
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (!isClientSide) {
      return;
    }

    resolveVoices().then((voices) => {
      // Google UK voices are the best for Ukrainian transliterations
      setVoice(
        voices.find((voice) => voice.name === 'Google UK English Female') ||
          voices.find((voice) => voice.name === 'Google UK English Male') ||
          voices.find((voice) => voice.lang === 'en' || voice.lang.startsWith('en-')) ||
          voices[0]
      );
    });
  }, [isClientSide]);

  return {
    isAvailable: !!voice,
    isActive,
    speak: (text: string) => {
      if (!voice) {
        return;
      }

      setIsActive(true);
      speak(text, voice).finally(() => setIsActive(false));
    }
  };
};

export default useSpeech;
