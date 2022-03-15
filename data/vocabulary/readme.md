# Contributing to the vocabulary

The vocabulary data is stored in this directory.
If you want to update the vocabulary, create or modify the corresponding JSON file(s) and submit a new pull request.

## File structure

```jsonc
// REMEMBER TO REMOVE THE COMMENTS BEFORE COMMITTING THE FILE!

// File name should be derived from "translation" field:
// - all lowercase
// - underscores instead of spaces or dashes
// - no special characters

// kyiv.json
{
  // Category of the vocabulary entry
  "category": "City",

  // Spelling in Ukrainian
  "name": "Київ",

  // Correct spelling in English
  "translation": "Kyiv",

  // Commonly used incorrect spellings in English (optional)
  "mistranslations": ["Kiev", "Kiyv", "Kyyv"],

  // Correct spelling in other languages (optional)
  "aliases": ["Киев", "Kijow", "Kiew"],

  // Additional information about the entry (optional)
  "description": "The capital and most populous city of Ukraine. Its name is derived from Proto-Slavic \"Kyjevŭ gordŭ\" (Kyi's castle) and is associated with Kyi, one of the city's legendary founders. Following the declaration of Ukraine's independence, the official English spelling of the capital became \"Kyiv\", replacing the outdated \"Kiev\" spelling based on Russian transliteration. Choosing the correct way to spell Kyiv is an integral part of asserting the Ukrainian identity as distinct from the relics of the Soviet Union and Russian Empire.",

  // Location of a geographical entity, such as a city (optional)
  "location": {
    "latitude": 50.4501,
    "longitude": 30.5234
  },

  // Links to relevant resources (optional)
  "externalLinks": [
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
  ]
}
```

## Transliteration system

Transliteration of Ukrainian sounds is based on the [official transliteration system adopted by Ukrainian Cabinet of Ministers](https://mfa.gov.ua/storage/app/sites/1/e-conf101-84-roman-system-ukraine-eng.pdf) in 2010.
This system is itself derived from the [ALA-LC transliteration system](https://loc.gov/catdir/cpso/romanization/ukrainia.pdf) with some nuances, notably:

- No diacritics
- No ligatures
- No apostrophes (meaning that `ь' and `'` are ignored)
- Some sounds may be mapped differently, depending on whether they're in the beginning of the word or not

Below is the table of transliteration mappings:

| Source  | Transliterated                                   |
| ------- | ------------------------------------------------ |
| `А` `а` | `A` `a`                                          |
| `Б` `б` | `B` `b`                                          |
| `В` `в` | `V` `v`                                          |
| `Г` `г` | `H` `h`                                          |
| `Ґ` `ґ` | `G` `g`                                          |
| `Д` `д` | `D` `d`                                          |
| `Е` `е` | `E` `e`                                          |
| `Є` `є` | `Ye` (beginning of the word) or `ie` (elsewhere) |
| `Ж` `ж` | `Zh` `zh`                                        |
| `З` `з` | `Z` `z`                                          |
| `И` `и` | `Y` `y`                                          |
| `І` `і` | `I` `i`                                          |
| `Ї` `ї` | `Yi` (beginning of the word) or `i` (elsewhere)  |
| `Й` `й` | `Yi` (beginning of the word) or `i` (elsewhere)  |
| `К` `к` | `K` `k`                                          |
| `Л` `л` | `L` `l`                                          |
| `М` `м` | `M` `m`                                          |
| `Н` `н` | `N` `n`                                          |
| `О` `о` | `O` `o`                                          |
| `П` `п` | `P` `p`                                          |
| `Р` `р` | `R` `r`                                          |
| `С` `с` | `S` `s`                                          |
| `Т` `т` | `T` `t`                                          |
| `У` `у` | `U` `u`                                          |
| `Ф` `ф` | `F` `f`                                          |
| `Х` `х` | `Kh` `kh`                                        |
| `Ц` `ц` | `Ts` `ts`                                        |
| `Ч` `ч` | `Ch` `ch`                                        |
| `Ш` `ш` | `Sh` `sh`                                        |
| `Щ` `щ` | `Shch` `shch`                                    |
| `Ю` `ю` | `Yu` (beginning of the word) or `iu` (elsewhere) |
| `Я` `я` | `Ya` (beginning of the word) or `ia` (elsewhere) |

With additional exceptions for compound sounds:

| Source    | Transliterated |
| --------- | -------------- |
| `Зг` `зг` | `Zgh` `zgh`    |
