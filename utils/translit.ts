// Ukrainian official transliteration is a simplified version of ALA-LC
const table = new Map<string, string>();
table.set(' ', ' ');
table.set('а', 'a');
table.set('б', 'b');
table.set('в', 'v');
table.set('г', 'h');
table.set('ґ', 'g');
table.set('д', 'd');
table.set('е', 'e');
table.set('є', 'ie');
table.set('ж', 'zh');
table.set('з', 'z');
table.set('и', 'y');
table.set('і', 'i');
table.set('ї', 'i');
table.set('й', 'i');
table.set('к', 'k');
table.set('л', 'l');
table.set('м', 'm');
table.set('н', 'n');
table.set('о', 'o');
table.set('п', 'p');
table.set('р', 'r');
table.set('с', 's');
table.set('т', 't');
table.set('у', 'u');
table.set('ф', 'f');
table.set('х', 'kh');
table.set('ц', 'ts');
table.set('ч', 'ch');
table.set('ш', 'sh');
table.set('щ', 'shch');
table.set('ю', 'iu');
table.set('я', 'ia');
table.set('ь', '');
table.set('А', 'A');
table.set('Б', 'B');
table.set('В', 'V');
table.set('Г', 'H');
table.set('Ґ', 'G');
table.set('Д', 'D');
table.set('Е', 'E');
table.set('Є', 'Ye');
table.set('Ж', 'Zh');
table.set('З', 'Z');
table.set('И', 'Y');
table.set('І', 'I');
table.set('Ї', 'Yi');
table.set('Й', 'Yi');
table.set('К', 'K');
table.set('Л', 'L');
table.set('М', 'M');
table.set('Н', 'N');
table.set('О', 'O');
table.set('П', 'P');
table.set('Р', 'R');
table.set('С', 'S');
table.set('Т', 'T');
table.set('У', 'U');
table.set('Ф', 'F');
table.set('Х', 'Kh');
table.set('Ц', 'Ts');
table.set('Ч', 'Ch');
table.set('Ш', 'Sh');
table.set('Щ', 'Shch');
table.set('Ю', 'Yu');
table.set('Я', 'Ya');
table.set('Ь', '');
table.set("'", '');

export const transliterate = (text: string) => {
  let result = '';
  let last = '';

  for (const c of text) {
    // Special case for 'ЗГ' compound
    if (last.toLowerCase() === 'з' && c.toLowerCase() === 'г') {
      result += 'gh';
    } else {
      if (!table.has(c)) {
        return null;
      }

      result += table.get(c);
    }

    last = c;
  }

  return result;
};
