# Berlin Classic Bikes

One-page demand test for a classic motorcycle rental in Berlin (all year round).
Static site on GitHub Pages, domain `berlinclassicbikes.de`.

- `index.html` – the page (DE/EN/RU/UA/TR, texts in `assets/js/i18n.js`)
- `assets/js/app.js` – bike cards, language switch, GoatCounter events, Web3Forms lead form
- `impressum.html`, `datenschutz.html` – legal pages (templates, check before launch)

## Analytics (GoatCounter, cookieless)
Dashboard: https://berlinclassicbikes.goatcounter.com

Events: `lang-auto/<lang>`, `lang/<lang>`, `cta/hero`, `cta/bike/<id>`, `view/prices`, `view/form`,
`form/start`, `form/sent/<bike>/<duration>`, `form/error`.

Ads: add `?utm_source=instagram&utm_campaign=spring27` to links; UTM values are also sent with each lead.

## Own photos
Put files into `assets/img/` and set `img` in the `BIKES` list in `assets/js/app.js`; remove the `credit` entry.
