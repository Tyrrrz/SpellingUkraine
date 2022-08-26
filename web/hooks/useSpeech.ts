import { useEffect, useState } from 'react';

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
    utterance.voice = voice || null;

    const onEnd = () => {
      utterance.removeEventListener('end', onEnd);
      resolve();
    };

    utterance.addEventListener('end', onEnd);
    speechSynthesis.speak(utterance);
  });
};

const useSpeech = () => {
  const clientSide = typeof window !== 'undefined';
  const [active, setActive] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();

  useEffect(() => {
    if (!clientSide) {
      return;
    }

    setVoices([]);
    resolveVoices().then(setVoices);
  }, [clientSide]);

  return {
    active,
    voices,
    speak: (text: string, voice?: SpeechSynthesisVoice) => {
      setActive(true);
      speak(text, voice).finally(() => setActive(false));
    }
  };
};

export default useSpeech;
