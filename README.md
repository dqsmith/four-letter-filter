# Four Letter Filter

Filter bad words from the websites that you and your children are visiting. Use the Four Letter Filter to mask unwanted bad words from popular social media like Facebook and Twitter, and filter foul language from any web site or web search result.

The Four Letter Filter removes over 425 bad words and word derivations found on the web. It will attempt filtering static content, dynamic content, and iframes. 

There are several categories of bad words that can be filtered:
* Really bad words will always be filtered. These should need no explanation.
* (Optional) Possibly offensive words which are generally biological or common household words that can be used within the context of a bad word or insult.
* (Optional) Biblical words that can be contextually misused.

## Demo

You can install via the [Chrome Web Store](https://chrome.google.com/webstore/detail/four-letter-filter/idchbmdbmcbmfeldjfkgailpngdcdbho).

## License

MIT details can be found [here](license.md)

## Get Started

Clone the repo and install the dependencies.

```
npm i
```

This is an angular-cli (angular 9) project, so you may want to install this globally.

```
npm i angular/cli@9.x.x -g
```

Test the extension

```
npm run test
```

Build the extension

```
npm run build
```

Verify build

1. Open chrome extension (**chrome://extensions/**)
2. Toggle **Developer mode**
3. **Load unpacked** extension
4. Select the **dist** directory for your build
5. Click the Four Letter Filter icon ![alt text](git_images/icon16.png "Four Letter Filter icon") on your Chrome extension bar 


Note: This extension will not work on the extensions page or the Chrome Web Store as a security precaution.
