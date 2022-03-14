# Contributing to the vocabulary

The vocabulary data is stored in this directory.
Each individual vocabulary entry is a separate JSON file with the following structure:

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

If you want to update the vocabulary, create or modify the corresponding file(s) and submit a new pull request.