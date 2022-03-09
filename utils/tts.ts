let voices = [] as SpeechSynthesisVoice[];

const getVoices = () => {
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    if (voices.length > 0) {
      resolve(voices);
    }

    const onVoicesChanged = () => {
      voices = speechSynthesis.getVoices();
      speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(voices);
    };

    speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
  });
};

const play = ({ text, voice }: { text: string; voice: SpeechSynthesisVoice }) => {
  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);

    const onEnd = () => {
      utterance.removeEventListener('end', onEnd);
      resolve();
    };

    utterance.addEventListener('end', onEnd);
    utterance.voice = voice;

    speechSynthesis.speak(utterance);
  });
};

export const pronounce = async (text: string) => {
  const voices = await getVoices();

  // Google UK voices are the best for Ukrainian transliterations
  const voice =
    voices.find((voice) => voice.name === 'Google UK English Female') ||
    voices.find((voice) => voice.name === 'Google UK English Male') ||
    voices.find((voice) => voice.lang === 'en' || voice.lang.startsWith('en-')) ||
    voices[0];

  await play({ text, voice });
};
