import { useEffect, useMemo, useState } from 'react';

const useSpeech = () => {
  const [isActive, setIsActive] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance>();

  // Initial voices
  useEffect(() => {
    setVoices(speechSynthesis.getVoices());
  }, []);

  // Lazy-loaded voices
  useEffect(() => {
    const onChange = () => {
      setVoices(speechSynthesis.getVoices());
    };

    speechSynthesis.addEventListener('voiceschanged', onChange);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', onChange);
    };
  }, []);

  // Active utterance
  useEffect(() => {
    const onEnd = () => {
      setIsActive(false);
      setCurrentUtterance(undefined);
    };

    if (currentUtterance) {
      currentUtterance.addEventListener('end', onEnd);

      setIsActive(true);
      speechSynthesis.speak(currentUtterance);
    }

    return () => {
      if (currentUtterance) {
        currentUtterance.removeEventListener('end', onEnd);
      }
    };
  }, [currentUtterance]);

  return useMemo(() => {
    return {
      isActive,
      voices,
      speak: (text: string, voice?: SpeechSynthesisVoice) => {
        if (currentUtterance) {
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice || null;

        setCurrentUtterance(utterance);
      }
    };
  }, [isActive, voices, currentUtterance]);
};

export default useSpeech;
