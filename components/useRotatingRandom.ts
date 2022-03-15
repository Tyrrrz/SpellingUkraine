import React from 'react';

const getRandomItem = <T>(items: T[]) => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const useRotatingRandom = <T>(items: T[], interval: number) => {
  const [item, setItem] = React.useState(() => getRandomItem(items));

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setItem(getRandomItem(items));
    }, interval);

    return () => clearInterval(intervalId);
  }, [items, interval]);

  return item;
};
