import { useEffect, useMemo, useState } from 'react';

const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance>();
  const isActive = !!currentUtterance;

  // Initial and lazy-loaded voices
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (!currentUtterance) {
      return;
    }

    const onEnd = () => {
      setCurrentUtterance(undefined);
    };

    currentUtterance.addEventListener('end', onEnd);
    speechSynthesis.speak(currentUtterance);

    return () => {
      currentUtterance.removeEventListener('end', onEnd);
    };
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
