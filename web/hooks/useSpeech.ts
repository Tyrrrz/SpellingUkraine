import { useEffect, useMemo, useState } from 'react';

const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance>();
  const [isActive, setIsActive] = useState(false);

  // Initial and lazy-loaded voices
  useEffect(() => {
    setVoices(speechSynthesis.getVoices());

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
    if (currentUtterance) {
      const onEnd = () => {
        setCurrentUtterance(undefined);
      };

      currentUtterance.addEventListener('end', onEnd);

      setIsActive(true);
      speechSynthesis.speak(currentUtterance);

      return () => {
        currentUtterance.removeEventListener('end', onEnd);
      };
    } else {
      setIsActive(false);
      return;
    }
  }, [currentUtterance]);

  return useMemo(() => {
    return {
      voices,
      speak: (text: string, voice?: SpeechSynthesisVoice) => {
        if (currentUtterance) {
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice || null;

        setCurrentUtterance(utterance);
      },
      isActive
    };
  }, [isActive, voices, currentUtterance]);
};

export default useSpeech;
