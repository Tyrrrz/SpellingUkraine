# SpellingUkraine

[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://vshymanskyy.github.io/StandWithUkraine)
[![Discord](https://img.shields.io/discord/869237470565392384?label=discord)](https://discord.gg/2SUWKFnHSm)
[![Donate](https://img.shields.io/badge/donate-$$$-8a2be2.svg)](https://tyrrrz.me/donate)
[![Fuck Russia](https://img.shields.io/badge/fuck-russia-e4181c.svg?labelColor=000000)](https://twitter.com/Tyrrrz/status/1495972128977571848)

✅ **Project status: active**<sup>[[?]](https://github.com/Tyrrrz/.github/blob/master/docs/project-status.md)</sup>

**SpellingUkraine** is a project that aims to promote the correct spelling of Ukrainian place names, personal names, and other words in English.
It's comprised of a website where you can quickly look up how to write individual names, as well as a set of bots that detect typical spelling mistakes online and correct them automatically.

## Production

- 🌐 Web app: [`https://spellingukraine.com`](https://spellingukraine.com) (hosted on [Vercel](https://vercel.com/tyrrrz/spellingukraine))
- 🤖 Reddit bot: [`u/SpellingUkraine`](https://reddit.com/u/SpellingUkraine) (hosted on [Heroku](https://dashboard.heroku.com/apps/spellingukraine))
- 🤖 Twitter bot: [`@SpellingUkraine`](https://twitter.com/SpellingUkraine) (hosted on [Heroku](https://dashboard.heroku.com/apps/spellingukraine))

## Development

Prerequisites:

- NodeJS
- Yarn

Before doing anything, install project dependencies by running:

```
yarn install
```

To start the web app, run:

```
yarn start:web
```

To start the Reddit bot, run:

```
yarn start:bot-reddit
```

To start the Twitter bot, run:

```
yarn start:bot-twitter
```

## Contributing to the vocabulary

Read the instructions [here](data/vocabulary).
