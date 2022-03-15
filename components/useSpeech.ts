import React from 'react';

const resolveVoices = () => {
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    if (!speechSynthesis) {
      resolve([]);
    }

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

const say = (text: string, voice?: SpeechSynthesisVoice) => {
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

export const useSpeech = () => {
  const [voice, setVoice] = React.useState<SpeechSynthesisVoice>();
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    resolveVoices().then((voices) => {
      // Google UK voices are the best for Ukrainian transliterations
      setVoice(
        voices.find((voice) => voice.name === 'Google UK English Female') ||
          voices.find((voice) => voice.name === 'Google UK English Male') ||
          voices.find((voice) => voice.lang === 'en' || voice.lang.startsWith('en-')) ||
          voices[0]
      );
    });
  }, []);

  return {
    available: !!voice,
    active,
    say: (text: string) => {
      if (!voice) {
        return;
      }

      setActive(true);
      say(text, voice).finally(() => setActive(false));
    }
  };
};
