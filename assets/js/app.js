/* Berlin Classic Bikes — page logic: i18n, bike cards, tracking, lead form. */
(function () {
  "use strict";

  var WEB3FORMS_KEY = "f522dc4e-001e-4fa5-975a-4667eb061060";
  var LANGS = ["de", "en", "ru", "uk", "tr"];
  var HERO_BIKE = "r100rs";

  /* Bikes. Photos live in assets/img/. V7 and R100 RS photos are the operator's own.
     T100 is a Wikimedia Commons example photo (copied by .github/workflows/fetch-images.yml),
     credited in the footer. Own photo: replace file, set credit: null. */
  var BIKES = [
    {
      id: "v7",
      year: "1971",
      img: "assets/img/v7.jpg",
      credit: null,
      specs: { engine: "spec.v7.engine", power: "spec.v7.power", drive: "spec.shaft", brakes: "spec.v7.brakes", top: "spec.v7.top", licence: "spec.licA" }
    },
    {
      id: "r100rs",
      year: "1984",
      img: "assets/img/r100rs.jpg",
      credit: null,
      specs: { engine: "spec.r100rs.engine", power: "spec.r100rs.power", drive: "spec.shaft", brakes: "spec.r100rs.brakes", top: "spec.r100rs.top", licence: "spec.licA" }
    },
    {
      id: "t100",
      year: "custom",
      img: "assets/img/t100.jpg",
      credit: { title: "Triumph Bonneville T100 (2011)", author: "Hogyn Lleol", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", source: "https://commons.wikimedia.org/wiki/File:Triumph_Bonneville_T100_(2011).jpg" },
      specs: { engine: "spec.t100.engine", power: "spec.t100.power", drive: "spec.chain", brakes: "spec.t100.brakes", top: "spec.t100.top", licence: "spec.licA" }
    }
  ];

  var dict = window.I18N;
  var lang = "de";

  /* ---------- helpers ---------- */
  function t(key) {
    var d = dict[lang] || dict.de;
    return (d && d[key] != null) ? d[key] : (dict.de[key] != null ? dict.de[key] : key);
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- tracking (GoatCounter, cookieless) ---------- */
  var queue = [];
  function track(path) {
    var gc = window.goatcounter;
    if (gc && typeof gc.count === "function") {
      try { gc.count({ path: path, title: path, event: true }); } catch (e) { /* ignore */ }
    } else {
      queue.push(path);
    }
  }
  var flushTimer = setInterval(function () {
    var gc = window.goatcounter;
    if (gc && typeof gc.count === "function") {
      clearInterval(flushTimer);
      var q = queue; queue = [];
      q.forEach(track);
    }
  }, 500);
  setTimeout(function () { clearInterval(flushTimer); }, 20000);

  /* ---------- marketing source, kept with the lead ---------- */
  var params = new URLSearchParams(location.search);
  var source = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    referrer: document.referrer || ""
  };

  /* ---------- language ---------- */
  function pickLang() {
    var q = (params.get("lang") || "").toLowerCase();
    if (q === "ua") q = "uk";
    if (LANGS.indexOf(q) > -1) return q;
    try {
      var saved = localStorage.getItem("bcb-lang");
      if (LANGS.indexOf(saved) > -1) return saved;
    } catch (e) { /* storage blocked */ }
    var nav = navigator.languages || [navigator.language || "de"];
    for (var i = 0; i < nav.length; i++) {
      var code = String(nav[i]).slice(0, 2).toLowerCase();
      if (LANGS.indexOf(code) > -1) return code;
    }
    return "de";
  }

  function applyLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    $all("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $all("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $all("[data-i18n-placeholder]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"))); });
    $all(".langs button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    renderBikes();
    renderMonths();
    renderHero();
    renderCredits();
  }

  /* ---------- bikes ---------- */
  function renderBikes() {
    var box = $("#bikes");
    if (!box) return;
    box.innerHTML = BIKES.map(function (b) {
      var name = t("bike." + b.id + ".name");
      var year = b.year === "custom" ? t("bike.t100.year") : t("bike.built") + " " + b.year;
      var photo = b.img
        ? '<img src="' + esc(b.img) + '"' + (b.remote ? ' data-fallback="' + esc(b.remote) + '"' : "") + ' alt="' + esc(t("bike." + b.id + ".alt")) + '" loading="lazy" width="1200" height="800" referrerpolicy="no-referrer">' +
          '<span class="tag">' + esc(t("bike.example")) + "</span>"
        : "";
      var fields = ["engine", "power", "drive", "brakes", "top", "licence"].map(function (k) {
        return "<div><dt>" + esc(t("spec.label." + k)) + "</dt><dd>" + esc(t(b.specs[k])) + "</dd></div>";
      }).join("");
      return '<article class="doc" data-bike="' + b.id + '">' +
        '<figure class="photo">' + photo + "</figure>" +
        '<div class="body">' +
          "<h3>" + esc(name) + "</h3>" +
          '<p class="year">' + esc(year) + "</p>" +
          '<p class="desc">' + esc(t("bike." + b.id + ".desc")) + "</p>" +
          '<dl class="fields">' + fields + "</dl>" +
          '<a class="btn" href="#anfrage" data-pick="' + b.id + '">' + esc(t("bike.cta")) + "</a>" +
        "</div></article>";
    }).join("");
  }

  /* next 12 months, labelled in the page language; "open" stays last */
  function renderMonths() {
    var sel = $("#f-month");
    if (!sel) return;
    var keep = sel.getAttribute("data-ready") ? sel.value : "";
    sel.setAttribute("data-ready", "1");
    var now = new Date();
    var opts = [];
    for (var i = 0; i < 12; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      var value = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
      var label;
      try { label = d.toLocaleDateString(lang, { month: "long", year: "numeric" }); }
      catch (e) { label = value; }
      label = label.charAt(0).toUpperCase() + label.slice(1);
      opts.push('<option value="' + value + '">' + esc(label) + "</option>");
    }
    opts.push('<option value="open">' + esc(t("form.whenOpen")) + "</option>");
    sel.innerHTML = opts.join("");
    if (keep && sel.querySelector('option[value="' + keep + '"]')) sel.value = keep;
    else sel.selectedIndex = 1; /* default: next month */
  }

  function renderHero() {
    var b = BIKES.filter(function (x) { return x.id === HERO_BIKE; })[0];
    var img = $("#hero-img");
    if (!img || !b) return;
    if (b.img) {
      if (b.remote) img.setAttribute("data-fallback", b.remote);
      if (img.getAttribute("src") !== b.img && !img.getAttribute("data-fell")) img.src = b.img;
      img.alt = t("bike." + b.id + ".alt"); img.hidden = false;
    }
    else { img.hidden = true; }
  }

  function renderCredits() {
    var box = $("#credits");
    if (!box) return;
    box.innerHTML = BIKES.filter(function (b) { return b.credit; }).map(function (b) {
      var c = b.credit;
      return "<p>" + esc(t("bike." + b.id + ".name")) + ": " +
        '<a href="' + esc(c.source) + '" rel="noopener">' + esc(c.title || t("foot.photo")) + "</a>, " +
        esc(c.author) + ", " +
        '<a href="' + esc(c.licenseUrl) + '" rel="noopener license">' + esc(c.license) + "</a>" +
        (c.changes ? ", " + esc(t("foot.cropped")) : "") + "</p>";
    }).join("");
  }

  /* local photo missing -> load the Wikimedia original once */
  document.addEventListener("error", function (e) {
    var el = e.target;
    if (el && el.tagName === "IMG" && el.getAttribute("data-fallback") && !el.getAttribute("data-fell")) {
      el.setAttribute("data-fell", "1");
      el.src = el.getAttribute("data-fallback");
    }
  }, true);

  /* ---------- clicks ---------- */
  document.addEventListener("click", function (e) {
    var langBtn = e.target.closest(".langs button");
    if (langBtn) {
      var l = langBtn.getAttribute("data-lang");
      try { localStorage.setItem("bcb-lang", l); } catch (err) { /* ignore */ }
      applyLang(l);
      track("lang/" + l);
      return;
    }
    var pick = e.target.closest("[data-pick]");
    if (pick) {
      var id = pick.getAttribute("data-pick");
      var sel = $("#f-bike");
      if (sel) sel.value = id;
      track("cta/bike/" + id);
      return;
    }
    var tr = e.target.closest("[data-track]");
    if (tr) track(tr.getAttribute("data-track"));
  });

  /* ---------- section views (once each) ---------- */
  if ("IntersectionObserver" in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target.getAttribute("data-view");
        if (en.isIntersecting && !seen[v]) { seen[v] = true; track("view/" + v); io.unobserve(en.target); }
      });
    }, { threshold: 0.35 });
    $all("[data-view]").forEach(function (el) { io.observe(el); });
  }

  /* ---------- form ---------- */
  var form = $("#lead-form");
  var started = false;
  if (form) {
    form.addEventListener("focusin", function () {
      if (!started) { started = true; track("form/start"); }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = $("#f-status");
      status.className = "status full";
      status.textContent = "";

      var required = [$("#f-name"), $("#f-email"), $("#f-consent")];
      var bad = required.filter(function (el) {
        var ok = el.type === "checkbox" ? el.checked : el.value.trim() !== "" && el.checkValidity();
        el.setAttribute("aria-invalid", String(!ok));
        return !ok;
      });
      if (bad.length) {
        status.className = "status full err";
        status.textContent = t("form.invalid");
        bad[0].focus();
        return;
      }

      var fd = new FormData(form);
      var bike = fd.get("bike");
      var duration = fd.get("duration");
      var bikeName = bike === "any" ? t("form.anyBike") : t("bike." + bike + ".name");
      var payload = {
        access_key: WEB3FORMS_KEY,
        subject: "Anfrage: " + (bike === "any" ? "egal" : dict.de["bike." + bike + ".name"]) + " / " + dict.de["form.d" + duration.charAt(0).toUpperCase() + duration.slice(1)] + " / " + fd.get("month"),
        from_name: "Berlin Classic Bikes Website",
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone") || "",
        bike: bikeName,
        duration: duration,
        month: fd.get("month"),
        days: fd.get("days") || "",
        message: fd.get("message") || "",
        language: lang,
        utm_source: source.utm_source,
        utm_medium: source.utm_medium,
        utm_campaign: source.utm_campaign,
        utm_content: source.utm_content,
        referrer: source.referrer,
        botcheck: form.elements.botcheck.checked
      };

      var btn = $("#f-submit");
      btn.disabled = true;
      btn.textContent = t("form.sending");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
        .then(function (res) {
          if (!res || !res.success) throw new Error((res && res.message) || "failed");
          track("form/sent/" + bike + "/" + duration);
          var box = $("#form-box");
          box.innerHTML = '<div class="form-done" tabindex="-1"><h3>' + esc(t("form.doneH")) + "</h3><p>" + esc(t("form.doneP")) + "</p></div>";
          box.firstChild.focus();
        })
        .catch(function () {
          track("form/error");
          btn.disabled = false;
          btn.textContent = t("form.submit");
          status.className = "status full err";
          status.innerHTML = t("form.error");
        });
    });
  }

  /* ---------- go ---------- */
  applyLang(pickLang());
  track("lang-auto/" + lang);
})();
