# Contributing to the vocabulary

The vocabulary data is stored in this directory.
If you want to update the vocabulary, create or modify the corresponding JSON file(s) and submit a pull request.

## File structure

Each vocabulary entry is stored in a JSON file with the following structure:

> **Warning**:
> Comments below are only used for documentation purposes.
> Remember to remove them from your own files to avoid parsing errors.

```jsonc
// File name: 'kyiv.json'
{
  // Category of the vocabulary entry
  "category": "City",

  // Original spelling in Ukrainian
  "sourceSpelling": "Київ",

  // Valid spelling in English
  "correctSpelling": "Kyiv",

  // [Optional] Commonly used invalid spellings in English
  "incorrectSpellings": ["Kiev", "Kiyv", "Kyyv"],

  // [Optional] Valid spellings in other languages or historic names associated with this entry
  "relatedSpellings": ["Киев", "Kijow", "Kyjiw", "Kiew"],

  // [Optional] Pronunciation hint for speech synthesis
  "transcription": "Kyeev",

  // [Optional] Additional information about the entry
  "description": "The capital and most populous city of Ukraine. Its name is derived from Proto-Slavic \"Kyjevŭ gordŭ\" (Kyi's castle) and is associated with Kyi, one of the city's legendary founders. Following the declaration of Ukraine's independence, the official English spelling of the capital became \"Kyiv\", replacing the outdated \"Kiev\" spelling based on Russian transliteration. Choosing the correct way to spell Kyiv is an integral part of asserting the Ukrainian identity as distinct from the relics of the Soviet Union and Russian Empire.",

  // [Optional] Links to relevant resources
  "links": [
    {
      "name": "Wikipedia: Kyiv",
      "url": "https://en.wikipedia.org/wiki/Kyiv"
    },
    {
      "name": "Wikipedia: KyivNotKiev",
      "url": "https://en.wikipedia.org/wiki/KyivNotKiev"
    },
    {
      "name": "YouTube: Kyiv, not Kiev",
      "url": "https://youtube.com/watch?v=WlGdw7AW-tU"
    },
    {
      "name": "MFA of Ukraine: #CorrectUA",
      "url": "https://mfa.gov.ua/en/correctua"
    }
  ],

  // [Optional] Geographical location associated with this entry
  "location": {
    "lat": 50.4501,
    "lng": 30.5234
  },

  // [Optional] Image associated with this entry
  "image": {
    "name": "View of Maidan Square",
    "url": "https://upload.wikimedia.org/.../kyiv_view_of_maidan_square.jpg"
  }
}
```

The name of the file is derived from the value of the `correctSpelling` field with the following adjustments:

- All characters are lowercase
- Spaces and dashes are replaced with underscores
- Special characters are removed

## Transliteration system

Transliteration of Ukrainian characters is based on the [official transliteration system](https://mfa.gov.ua/storage/app/sites/1/e-conf101-84-roman-system-ukraine-eng.pdf), adopted by the Cabinet of Ministers in 2010.
This system is itself derived from the [ALA-LC transliteration system](https://loc.gov/catdir/cpso/romanization/ukrainia.pdf) with some nuances, notably:

- No diacritics
- No ligatures
- No apostrophes (`ь` and `'` are both ignored)
- Position-aware mapping for certain characters

Below is the full mapping table for the Ukrainian alphabet:

| Source    | Transliterated                                   |
| --------- | ------------------------------------------------ |
| `А` `а`   | `A` `a`                                          |
| `Б` `б`   | `B` `b`                                          |
| `В` `в`   | `V` `v`                                          |
| `Г` `г`   | `H` `h`                                          |
| `Ґ` `ґ`   | `G` `g`                                          |
| `Д` `д`   | `D` `d`                                          |
| `Е` `е`   | `E` `e`                                          |
| `Є` `є`   | `Ye` (beginning of the word) or `ie` (elsewhere) |
| `Ж` `ж`   | `Zh` `zh`                                        |
| `З` `з`   | `Z` `z`                                          |
| `И` `и`   | `Y` `y`                                          |
| `І` `і`   | `I` `i`                                          |
| `Ї` `ї`   | `Yi` (beginning of the word) or `i` (elsewhere)  |
| `Й` `й`   | `Yi` (beginning of the word) or `i` (elsewhere)  |
| `К` `к`   | `K` `k`                                          |
| `Л` `л`   | `L` `l`                                          |
| `М` `м`   | `M` `m`                                          |
| `Н` `н`   | `N` `n`                                          |
| `О` `о`   | `O` `o`                                          |
| `П` `п`   | `P` `p`                                          |
| `Р` `р`   | `R` `r`                                          |
| `С` `с`   | `S` `s`                                          |
| `Т` `т`   | `T` `t`                                          |
| `У` `у`   | `U` `u`                                          |
| `Ф` `ф`   | `F` `f`                                          |
| `Х` `х`   | `Kh` `kh`                                        |
| `Ц` `ц`   | `Ts` `ts`                                        |
| `Ч` `ч`   | `Ch` `ch`                                        |
| `Ш` `ш`   | `Sh` `sh`                                        |
| `Щ` `щ`   | `Shch` `shch`                                    |
| `Ю` `ю`   | `Yu` (beginning of the word) or `iu` (elsewhere) |
| `Я` `я`   | `Ya` (beginning of the word) or `ia` (elsewhere) |
| `Зг` `зг` | `Zgh` `zgh`                                      |

> **Note**:
> Special mapping is used for the character sequence `зг` to avoid ambiguity with character `ж`.
