# Berlin Classic Bikes

One-page demand test for a classic motorcycle rental in Berlin (all year round).
Static site on GitHub Pages, domain `berlinclassicbikes.de`.

- `index.html` – old design (DE/EN/RU/UA/TR, texts in `assets/js/i18n.js`)
- `new.html` – new design from the mockup (`assets/css/new.css`); same texts, form and tracking
- Design switch (bottom left) on both pages; the choice is kept in localStorage.
  Links: `/?design=new` or `/?design=old` force a variant.
- `assets/js/app.js` – bike cards, language switch, GoatCounter events, Web3Forms lead form
- `impressum.html`, `datenschutz.html` – legal pages (templates, check before launch)

## Analytics (GoatCounter, cookieless)
Dashboard: https://berlinclassicbikes.goatcounter.com

Pageviews: `/` = old design, `/new.html` = new design.
Events are prefixed with the design (`old/…`, `new/…`): `lang-auto/<lang>`, `lang/<lang>`, `cta/hero`, `cta/nav`,
`cta/see`, `cta/bike/<id>`, `view/bikes|prices|how|form`, `form/start`, `form/sent/<bike>/<duration|dates>`,
`form/error`, `design/<old|new>`.

Ads: add `?utm_source=instagram&utm_campaign=spring27` to links; UTM values are also sent with each lead.

## Own photos
Put files into `assets/img/` and set `img` in the `BIKES` list in `assets/js/app.js`; remove the `credit` entry.
