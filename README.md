# Berlin Classic Bikes

One-page demand test for a classic motorcycle rental in Berlin (all year round).
Static site on GitHub Pages, domain `berlinclassicbikes.de`.

Three design variants share texts (`assets/js/i18n.js`, DE/EN/RU/UA/TR), form and tracking (`assets/js/app.js`):
- A – `index.html` (`assets/css/style.css`), the first version
- B – `b.html` (`assets/css/new.css`), from mockup "Landing"
- C – `c.html` (`assets/css/c.css`), from mockup "Landing 2"
- Design switch in the top bar of every page; the choice is kept in localStorage.
  Links `/?design=a`, `/?design=b`, `/?design=c` force a variant (e.g. for ads).
- `assets/js/app.js` – bike cards, language switch, GoatCounter events, Web3Forms lead form
- `impressum.html`, `datenschutz.html` – legal pages (templates, check before launch)

## Analytics (GoatCounter, cookieless)
Dashboard: https://berlinclassicbikes.goatcounter.com

Pageviews: `/` = A, `/b.html` = B, `/c.html` = C.
Events are prefixed with the variant (`a/…`, `b/…`, `c/…`): `lang-auto/<lang>`, `lang/<lang>`, `cta/hero`, `cta/nav`,
`cta/see`, `cta/bike/<id>`, `view/bikes|prices|how|form`, `form/start`, `form/sent/<bike>/<duration|dates>`,
`form/error`, `design/<a|b|c>`.

Ads: add `?utm_source=instagram&utm_campaign=spring27` to links; UTM values are also sent with each lead.

## Own photos
Put files into `assets/img/` and set `img` in the `BIKES` list in `assets/js/app.js`; remove the `credit` entry.
