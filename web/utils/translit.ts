const translitChar = (cur: string, prev: string) => {
  const isInitial = !prev || /^\s$/.test(prev);

  if (cur === ' ') {
    return cur;
  }

  if (cur === 'а') {
    return 'a';
  }

  if (cur === 'А') {
    return 'A';
  }

  if (cur === 'б') {
    return 'b';
  }

  if (cur === 'Б') {
    return 'B';
  }

  if (cur === 'в') {
    return 'v';
  }

  if (cur === 'В') {
    return 'V';
  }

  if (cur === 'г') {
    if (prev === 'з' || prev === 'З') {
      return 'gh';
    }

    return 'h';
  }

  if (cur === 'Г') {
    if (prev === 'з' || prev === 'З') {
      return 'Gh';
    }

    return 'H';
  }

  if (cur === 'ґ') {
    return 'g';
  }

  if (cur === 'Ґ') {
    return 'G';
  }

  if (cur === 'д') {
    return 'd';
  }

  if (cur === 'Д') {
    return 'D';
  }

  if (cur === 'е') {
    return 'e';
  }

  if (cur === 'Е') {
    return 'E';
  }

  if (cur === 'є') {
    if (isInitial) {
      return 'ye';
    }

    return 'ie';
  }

  if (cur === 'Є') {
    if (isInitial) {
      return 'Ye';
    }

    return 'Ie';
  }

  if (cur === 'ж') {
    return 'zh';
  }

  if (cur === 'Ж') {
    return 'Zh';
  }

  if (cur === 'з') {
    return 'z';
  }

  if (cur === 'З') {
    return 'Z';
  }

  if (cur === 'и') {
    return 'y';
  }

  if (cur === 'И') {
    return 'Y';
  }

  if (cur === 'і') {
    return 'i';
  }

  if (cur === 'І') {
    return 'I';
  }

  if (cur === 'ї') {
    return 'i';
  }

  if (cur === 'Ї') {
    return 'Yi';
  }

  if (cur === 'й') {
    if (isInitial) {
      return 'yi';
    }

    return 'i';
  }

  if (cur === 'Й') {
    if (isInitial) {
      return 'Yi';
    }

    return 'I';
  }

  if (cur === 'к') {
    return 'k';
  }

  if (cur === 'К') {
    return 'K';
  }

  if (cur === 'л') {
    return 'l';
  }

  if (cur === 'Л') {
    return 'L';
  }

  if (cur === 'м') {
    return 'm';
  }

  if (cur === 'М') {
    return 'M';
  }

  if (cur === 'н') {
    return 'n';
  }

  if (cur === 'Н') {
    return 'N';
  }

  if (cur === 'о') {
    return 'o';
  }

  if (cur === 'О') {
    return 'O';
  }

  if (cur === 'п') {
    return 'p';
  }

  if (cur === 'П') {
    return 'P';
  }

  if (cur === 'р') {
    return 'r';
  }

  if (cur === 'Р') {
    return 'R';
  }

  if (cur === 'с') {
    return 's';
  }

  if (cur === 'С') {
    return 'S';
  }

  if (cur === 'т') {
    return 't';
  }

  if (cur === 'Т') {
    return 'T';
  }

  if (cur === 'у') {
    return 'u';
  }

  if (cur === 'У') {
    return 'U';
  }

  if (cur === 'ф') {
    return 'f';
  }

  if (cur === 'Ф') {
    return 'F';
  }

  if (cur === 'х') {
    return 'kh';
  }

  if (cur === 'Х') {
    return 'Kh';
  }

  if (cur === 'ц') {
    return 'ts';
  }

  if (cur === 'Ц') {
    return 'Ts';
  }

  if (cur === 'ч') {
    return 'ch';
  }

  if (cur === 'Ч') {
    return 'Ch';
  }

  if (cur === 'ш') {
    return 'sh';
  }

  if (cur === 'Ш') {
    return 'Sh';
  }

  if (cur === 'щ') {
    return 'shch';
  }

  if (cur === 'Щ') {
    return 'Shch';
  }

  if (cur === 'ю') {
    if (isInitial) {
      return 'yu';
    }

    return 'iu';
  }

  if (cur === 'Ю') {
    if (isInitial) {
      return 'Yu';
    }

    return 'Iu';
  }

  if (cur === 'я') {
    if (isInitial) {
      return 'ya';
    }

    return 'ia';
  }

  if (cur === 'Я') {
    if (isInitial) {
      return 'Ya';
    }

    return 'Ia';
  }

  if (cur === 'ь' || cur === 'Ь') {
    return '';
  }

  if (cur === "'") {
    return '';
  }

  return null;
};

export const translit = (text: string) => {
  let result = '';
  let prev = '';

  for (const cur of text) {
    result += translitChar(cur, prev) ?? cur;
    prev = cur;
  }

  return result;
};
