/* =============================================================================
   MONASH AI CAREER ACCELERATOR — Canvas LMS Theme JavaScript
   FourthRev | built on the Cambridge (CAM CY) modular pattern
   Pairs with: CSS_MONASH_AI.css
   Target: WCAG 2.2 AA

   WHY THIS FILE LOOKS THE WAY IT DOES
   - Structure follows the CAM CY build: small, self-contained IIFEs, each with
     "use strict" and each idempotent (safe to run more than once).
   - Content-bound modules register their enhancer with the shared MonashTheme
     content watcher (see "SHARED" block below) instead of each running its own
     one-shot MutationObserver. The watcher runs enhancers on first render AND on
     every later Canvas partial re-render / SPA-style navigation, so components
     injected after first paint are still wired up. (The H5P resizer is the one
     exception: it is not content-bound, so it loads on ready and listens for
     postMessage height events — it does not need the content watcher.)
   - Global listeners (window "message", document "keydown") are registered once,
     guarded by a window flag, so a double-load of the theme cannot duplicate them.
   - It binds to the SAME component classes the authored Monash content uses
     (.wcag-page-banner, .wcag-glossary-term, .wcag-card[data-href],
     .video-transcript-link, etc.), confirmed against the full page inventory.
   - Each module is here because a component in the content needs it. Modules
     with no matching component were deliberately left out (see the companion
     "carried / renamed / dropped" note).

   DELIBERATELY NOT INCLUDED (and why)
   - Learning-outcomes popup (LSE initULOContent / getPopupTxt): hard-coded
     per-course LO text inside the theme JS. Entangles content with
     presentation, makes the file course-specific, and hides outcomes behind a
     click. Monash authors outcomes directly into the page using the well/list
     components instead. CAM dropped it; we do too.
   - targetBlank (force external links to open in new tabs): Cambridge's own
     accessibility guidance warns against forcing new windows (back-button and
     orientation issues for AT users). Left out.
   - The all-fonts @import (LSE injected the ENTIRE Google Fonts library):
     a severe performance problem and pure cruft. The theme CSS loads only the
     two Monash families it needs.
   - Accordion JS handler: Monash content uses native <details>/<summary>, which
     is keyboard- and screen-reader-accessible with zero JavaScript. No handler
     needed.
   - Carousels / tabs / slideshows / read-more: not used in Monash content.
============================================================================= */


/* =============================================================================
   SHARED — CONTENT WATCHER + MODAL BACKGROUND HELPER
   One MutationObserver for the whole theme. Content-bound modules register an
   idempotent enhancer via MonashTheme.onContent(fn); the watcher runs every
   enhancer once on DOM ready and again (debounced) whenever Canvas mutates the
   page — covering async render, partial re-renders, and SPA-style navigation.
   Enhancers MUST be idempotent and cheap (guard per element, e.g. a data flag).
   setBackgroundInert() hides the Canvas app wrapper from AT while a modal is
   open, so the dialog is genuinely modal for screen-reader and keyboard users.
   Guarded so a double-load of the theme reuses the single instance.
============================================================================= */
window.MonashTheme = window.MonashTheme || (function () {
    "use strict";

    var enhancers = [];
    var observer = null;
    var pending = null;

    function ready(cb) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", cb);
        } else {
            cb();
        }
    }

    function runEnhancers() {
        pending = null;
        for (var i = 0; i < enhancers.length; i++) {
            try {
                enhancers[i]();
            } catch (e) {
                if (window.console && console.error) {
                    console.error("[MonashTheme] enhancer failed:", e);
                }
            }
        }
    }

    function scheduleRun() {
        if (pending !== null) return;          // coalesce mutation bursts
        pending = window.setTimeout(runEnhancers, 100);
    }

    function startObserver() {
        if (observer || !document.body) return;
        observer = new MutationObserver(scheduleRun);
        // childList/subtree only — attribute writes by our own enhancers must
        // NOT retrigger the observer, or we could loop.
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function onContent(fn) {
        enhancers.push(fn);
        ready(function () {
            startObserver();
            try { fn(); } catch (e) {}          // run now for content already present
        });
    }

    function setBackgroundInert(on) {
        // Hide everything in the Canvas app shell from AT while a modal is open.
        // Modals are appended to <body> as siblings of #application, so they stay
        // reachable. No-op if the wrapper is absent; the focus trap still applies.
        var app = document.getElementById("application");
        if (!app) return;
        if (on) {
            app.setAttribute("aria-hidden", "true");
            app.setAttribute("inert", "");
        } else {
            app.removeAttribute("aria-hidden");
            app.removeAttribute("inert");
        }
    }

    function markThemeActive() {
        // Signals to the CSS that the theme JS is running. The paired stylesheet
        // hides JS-enhanced source blocks (e.g. .video-transcript, which the
        // transcript modal clones) ONLY under body.monash-theme-js, so if this
        // script fails to load that content stays visible/reachable as a fallback.
        ready(function () {
            if (document.body) document.body.classList.add("monash-theme-js");
        });
    }
    markThemeActive();

    return {
        onContent: onContent,
        setBackgroundInert: setBackgroundInert
    };
})();


/* =============================================================================
   1. INTERACTIVE IFRAME RESIZER  (portfolio build)
   In Canvas this slot loads the Loree/H5P resizer. On this static site the
   embedded placeholders come from the interactive catalogue, which report
   their content height with postMessage({type:"resize", height}). The iframe
   is matched by contentWindow === event.source, origin is limited to this
   site, and the height is clamped, as in the Canvas version.
============================================================================= */
(function () {
    "use strict";
    var MAX_FRAME_HEIGHT = 20000;
    function receiveMessage(event) {
        if (event.origin !== window.location.origin) return;
        if (!event.data || event.data.type !== "resize") return;
        var height = parseInt(event.data.height, 10);
        if (!isFinite(height) || height <= 0) return;
        if (height > MAX_FRAME_HEIGHT) height = MAX_FRAME_HEIGHT;
        var frames = document.getElementsByTagName("iframe");
        for (var i = 0; i < frames.length; i++) {
            if (frames[i].contentWindow === event.source) {
                frames[i].style.height = height + "px";
            }
        }
    }
    if (!window.__monashResizeBound) {
        window.__monashResizeBound = true;
        window.addEventListener("message", receiveMessage, false);
    }
})();


/* =============================================================================
   2. IMAGE LIGHTBOX (Pages only) — accessible dialog, opt-in
   Images an author marks with class="wcag-zoomable" are enhanced at runtime into
   focusable zoom triggers (role="button", tabindex, accessible name from alt) and
   open a true modal overlay: role="dialog", aria-modal, labelled, with a visible
   close button, focus moved into the dialog on open, Tab kept inside it,
   Escape/overlay/close-button to dismiss, and focus returned to the triggering
   image on close. Background is made inert while open. Opt-in (not all content
   images) keeps icons/diagrams/decorative images out of the tab order and matches
   the paired CSS, which scopes the zoom styling to the same .wcag-zoomable class.
   Excluded even if marked: linked images (left to navigate), card images, page
   banners, summary toggles, and Canvas chrome (header/nav).
============================================================================= */
(function () {
    "use strict";

    var OVERLAY_ID = "image-lightbox-overlay";
    var overlay = null, overlayImg = null, closeBtn = null, activeTrigger = null;

    function isEligible(el) {
        if (!el || el.tagName !== "IMG") return false;
        // Opt-in only: an author marks an image zoomable with class="wcag-zoomable".
        // This matches the paired CSS, which scopes the zoom styling to the same
        // class, so only deliberately-zoomable images become focusable triggers
        // (avoids turning every content image into a button).
        if (!el.classList.contains("wcag-zoomable")) return false;
        // Belt-and-suspenders: a decorative image (alt="") should not become a
        // focusable "Enlarge image" button with no meaningful name. Opt-in already
        // makes this unlikely (an author wouldn't mark a decorative image zoomable),
        // but skip empty/whitespace alt to be safe.
        if (!(el.getAttribute("alt") || "").trim()) return false;
        // Never hijack an image that is itself a link or part of a clickable card.
        if (el.closest("a") !== null) return false;
        if (el.closest(".wcag-card[data-href]") !== null) return false;
        if (el.closest(".wcag-page-banner") !== null) return false;
        if (el.closest("summary") !== null) return false;
        if (el.closest(".ic-app-header") !== null) return false;
        if (el.closest("#header") !== null) return false;
        return true;
    }

    function buildOverlay() {
        overlay = document.createElement("div");
        overlay.id = OVERLAY_ID;
        overlay.className = "image-lightbox-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Enlarged image");
        overlay.setAttribute("aria-hidden", "true");

        overlayImg = document.createElement("img");
        overlayImg.setAttribute("alt", "");

        closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "image-lightbox-overlay__close";
        closeBtn.setAttribute("aria-label", "Close image");
        closeBtn.innerHTML = "&#x2715;";
        closeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeOverlay();
        });

        overlay.appendChild(overlayImg);
        overlay.appendChild(closeBtn);
        overlay.addEventListener("click", closeOverlay); // scrim / image click closes
        document.body.appendChild(overlay);
    }

    function isOpen() {
        return overlay && overlay.getAttribute("aria-hidden") === "false";
    }

    function openOverlay(trigger) {
        if (!overlay) buildOverlay();
        overlayImg.src = trigger.src;
        // Mirror the alt text so the zoomed image keeps its accessible name.
        overlayImg.setAttribute("alt", trigger.getAttribute("alt") || "");
        overlay.style.display = "flex";
        overlay.setAttribute("aria-hidden", "false");
        activeTrigger = trigger;
        closeBtn.focus();                       // move focus into the dialog first…
        window.MonashTheme.setBackgroundInert(true); // …then hide the background
    }

    function closeOverlay() {
        if (!isOpen()) return;
        window.MonashTheme.setBackgroundInert(false);
        var trigger = activeTrigger;
        activeTrigger = null;
        if (trigger && typeof trigger.focus === "function") {
            trigger.focus();                    // return focus before hiding the dialog
        }
        overlay.setAttribute("aria-hidden", "true");
        overlay.style.display = "none";
        overlayImg.src = "";
    }

    function onGlobalKeydown(e) {
        if (!isOpen()) return;
        if (e.key === "Escape") {
            closeOverlay();
            return;
        }
        if (e.key === "Tab") {
            // Close button is the only focusable element — keep focus on it.
            e.preventDefault();
            closeBtn.focus();
        }
    }

    function enhanceImages() {
        var imgs = document.querySelectorAll(".show-content img.wcag-zoomable");
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            if (img.dataset.lightboxEnhanced) continue;
            if (!isEligible(img)) continue;
            img.dataset.lightboxEnhanced = "1";
            if (!img.getAttribute("tabindex")) img.setAttribute("tabindex", "0");
            if (!img.getAttribute("role"))     img.setAttribute("role", "button");
            var name = (img.getAttribute("alt") || "").trim();
            img.setAttribute("aria-label", name ? ("Enlarge image: " + name) : "Enlarge image");
        }
    }

    function triggerFromEvent(e) {
        var img = e.target && e.target.closest ? e.target.closest("img") : null;
        return (img && img.dataset.lightboxEnhanced) ? img : null;
    }

    function onContentClick(e) {
        var img = triggerFromEvent(e);
        if (img) openOverlay(img);
    }

    function onContentKeydown(e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var img = triggerFromEvent(e);
        if (!img) return;
        e.preventDefault();
        openOverlay(img);
    }

    // Global listeners registered once (guarded against double-load).
    if (!window.__monashLightboxBound) {
        window.__monashLightboxBound = true;
        document.addEventListener("click", onContentClick);
        document.addEventListener("keydown", onContentKeydown);
        document.addEventListener("keydown", onGlobalKeydown);
    }

    window.MonashTheme.onContent(enhanceImages);
})();


/* =============================================================================
   3. TRANSCRIPT MODAL
   Opens the video transcript in a centred modal styled identically to the
   glossary modal (same overlay, card, header, close button), just wider for
   long-form text. Replaces both the old inline toggle and the reliance on
   Canvas's default jQuery-UI dialog.

   Authored markup: a trigger <a class="video-transcript-link" aria-controls="ID">
   and a source <div id="ID" class="... video-transcript"> holding the title
   (h3) and transcript paragraphs. Canvas tries to hijack any element with
   class "enhanceable_content dialog" into its own plain dialog, so this module
   strips those classes from the source to prevent the default dialog, then
   clones the content into our styled modal on demand. One modal is built once
   and reused. Closes on close button, overlay click, or Escape; focus moves to
   the close button on open and back to the trigger on close, and the background
   is made inert while open. Triggers are (re)bound by the shared content watcher,
   so transcripts injected after first render are still wired up.
============================================================================= */
(function () {
    "use strict";

    var MODAL_ID   = "wcag-transcript-modal";
    var OPEN_CLASS = "wcag-transcript-modal--open";

    var modal = null, titleEl = null, bodyEl = null, closeBtn = null, activeTrigger = null;

    function buildModal() {
        modal = document.createElement("div");
        modal.id = MODAL_ID;
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "wcag-transcript-modal-title");
        modal.setAttribute("aria-hidden", "true");

        var card = document.createElement("div");
        card.className = "wcag-transcript-card";
        card.addEventListener("click", function (e) { e.stopPropagation(); });

        var header = document.createElement("div");
        header.className = "wcag-transcript-card__header";

        titleEl = document.createElement("p");
        titleEl.id = "wcag-transcript-modal-title";
        titleEl.className = "wcag-transcript-card__title";

        closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "wcag-transcript-card__close";
        closeBtn.setAttribute("aria-label", "Close transcript");
        closeBtn.innerHTML = "&#x2715;";
        closeBtn.addEventListener("click", closeModal);

        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        var divider = document.createElement("hr");
        divider.className = "wcag-transcript-card__divider";
        divider.setAttribute("aria-hidden", "true");

        bodyEl = document.createElement("div");
        bodyEl.className = "wcag-transcript-card__body";

        card.appendChild(header);
        card.appendChild(divider);
        card.appendChild(bodyEl);
        modal.appendChild(card);

        modal.addEventListener("click", closeModal);
        document.body.appendChild(modal);
    }

    function openModal(trigger, source) {
        if (!modal) buildModal();

        // Title: prefer the source's heading, else the trigger's title/text.
        var heading = source.querySelector("h3, h2, .video-transcript__title");
        titleEl.textContent = heading
            ? heading.textContent.trim()
            : (trigger.getAttribute("title") || "Transcript");

        // Body: clone the source's content once, minus the heading.
        bodyEl.innerHTML = "";
        var clone = source.cloneNode(true);
        // Snapshot to a static array BEFORE moving nodes: clone.childNodes is a
        // live NodeList, and appendChild() moves each node out of the clone,
        // which would shrink the list mid-loop and skip nodes. The array holds
        // references, so iteration is unaffected by the moves.
        var nodes = Array.prototype.slice.call(clone.childNodes);
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.nodeType === 1 && n.matches("h3, h2, .video-transcript__title")) continue;
            // Strip ids from cloned subtree to avoid duplicate-id collisions.
            stripIds(n);
            bodyEl.appendChild(n);
        }

        modal.classList.add(OPEN_CLASS);
        modal.setAttribute("aria-hidden", "false");
        activeTrigger = trigger;
        trigger.setAttribute("aria-expanded", "true");
        closeBtn.focus();                       // focus into the dialog first…
        window.MonashTheme.setBackgroundInert(true); // …then hide the background
    }

    function stripIds(node) {
        if (node.nodeType !== 1) return;
        if (node.id) node.removeAttribute("id");
        var withId = node.querySelectorAll ? node.querySelectorAll("[id]") : [];
        for (var i = 0; i < withId.length; i++) withId[i].removeAttribute("id");
    }

    function closeModal() {
        if (!modal || !modal.classList.contains(OPEN_CLASS)) return;
        window.MonashTheme.setBackgroundInert(false);
        var trigger = activeTrigger;
        activeTrigger = null;
        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();                    // return focus before hiding the dialog
        }
        modal.classList.remove(OPEN_CLASS);
        modal.setAttribute("aria-hidden", "true");
    }

    function neutraliseSource(source) {
        // Stop Canvas turning this into its own dialog.
        source.classList.remove("enhanceable_content", "dialog");
        source.removeAttribute("data-dialog");
    }

    function resolveTrigger(link) {
        return link.matches("a") ? link : (link.querySelector("a") || link);
    }

    function targetIdOf(trigger) {
        return trigger.getAttribute("aria-controls") ||
               (trigger.getAttribute("href") || "").replace(/^#/, "");
    }

    function bindTranscripts() {
        var links = document.querySelectorAll(".video-transcript-link");
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.dataset.transcriptBound) continue; // guard (idempotent)
            link.dataset.transcriptBound = "1";

            var trigger = resolveTrigger(link);
            var targetId = targetIdOf(trigger);
            if (!targetId) continue;

            var source = document.getElementById(targetId);
            if (source) neutraliseSource(source);

            if (!trigger.hasAttribute("aria-expanded")) {
                trigger.setAttribute("aria-expanded", "false");
            }
            if (!trigger.hasAttribute("aria-haspopup")) {
                trigger.setAttribute("aria-haspopup", "dialog");
            }
        }
    }

    function getFocusable(root) {
        // Focusable elements inside the modal, for the Tab-wrap focus trap.
        return Array.prototype.slice.call(root.querySelectorAll(
            "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
        )).filter(function (el) {
            return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
        });
    }

    function onGlobalKeydown(e) {
        if (!modal || !modal.classList.contains(OPEN_CLASS)) return;
        if (e.key === "Escape") {
            closeModal();
            return;
        }
        // Focus trap: keep Tab within the open modal (WCAG 2.1.2 / 2.4.3).
        if (e.key === "Tab") {
            var focusable = getFocusable(modal);
            if (focusable.length === 0) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function onContentClick(e) {
        var link = e.target && e.target.closest ? e.target.closest(".video-transcript-link") : null;
        if (!link) return;
        e.preventDefault();
        e.stopPropagation();
        var trigger = resolveTrigger(link);
        var src = document.getElementById(targetIdOf(trigger));
        if (src) openModal(trigger, src);
    }

    // Global listeners registered once (guarded against double-load).
    if (!window.__monashTranscriptBound) {
        window.__monashTranscriptBound = true;
        document.addEventListener("keydown", onGlobalKeydown);
        document.addEventListener("click", onContentClick);
    }

    window.MonashTheme.onContent(bindTranscripts);
})();


/* =============================================================================
   4. CARD NAVIGATION
   Makes .wcag-card[data-href] behave as a navigable link. role="link" and
   tabindex are authored in the HTML; this adds click + keyboard (Enter/Space)
   handlers.
   Events originating from a genuine interactive descendant (link, button, form
   control, summary, etc.) are ignored, so nested controls are not hijacked.
   Placeholder hrefs ("#" or empty) are ignored so template pages do not navigate.
   Delegated from document, so cards injected after first render still work.
   Canvas-safe: does not require the element to be an <a>.
============================================================================= */
(function () {
    "use strict";

    var INTERACTIVE =
        "a, button, input, select, textarea, summary, label, " +
        "[role=\"button\"], [role=\"link\"], [contenteditable=\"true\"]";

    function navigate(card) {
        var href = card.getAttribute("data-href");
        if (href && href !== "#" && href.trim() !== "") {
            window.location.href = href;
        }
    }

    function cardFromEvent(e) {
        var card = e.target && e.target.closest ? e.target.closest(".wcag-card[data-href]") : null;
        if (!card) return null;
        // Ignore events that came from an interactive control inside the card.
        var interactive = e.target.closest(INTERACTIVE);
        if (interactive && interactive !== card && card.contains(interactive)) return null;
        return card;
    }

    function onClick(e) {
        var card = cardFromEvent(e);
        if (card) navigate(card);
    }

    function onKeydown(e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var card = cardFromEvent(e);
        if (!card) return;
        e.preventDefault();
        navigate(card);
    }

    if (!window.__monashCardsBound) {
        window.__monashCardsBound = true;
        document.addEventListener("click", onClick);
        document.addEventListener("keydown", onKeydown);
    }
})();


/* =============================================================================
   5. PAGE BANNER
   Canvas strips most banner child markup on save, reliably preserving only the
   <img> (sometimes as .wcag-page-banner__source, sometimes bare). This recreates
   the image div (as a CSS background) and a title overlay at runtime, and moves
   the Canvas page title into the overlay. The original Canvas heading is kept in
   the DOM but visually hidden, so its accessible name is preserved for screen
   readers. Initialisation runs through the shared content watcher (covering async
   render and SPA navigation); a data flag prevents double-initialisation.

   This consolidates CAM's two banner systems (.camcyber-banner and
   .wcag-page-banner) into the single .wcag-page-banner system that the Monash
   authored content actually uses.
============================================================================= */
(function () {
    "use strict";

    /* Discussions use the banner like any other page, with two traps:
       (1) The React Discussions UI <h1> (data-testid="message_title") contains
       a screen-reader-only span that DUPLICATES the title with a "Discussion
       Topic:" prefix, so reading textContent doubles the title in the overlay.
       applyTitle therefore reads only the VISIBLE parts of the heading (see
       visibleTitleText).
       (2) React re-renders that heading at will and strips any class this JS
       adds to it, so hiding the native title bar from here is unreliable — the
       PAIRED CSS hides it instead, with a persistent :has() rule
       (body:has(.wcag-page-banner) h1[data-testid="message_title"]), which a
       re-render cannot strip. The classList.add below still runs for the
       non-React page types.
       The fallback heading selector is scoped to the Canvas content area so a
       stray <h1> elsewhere on the page cannot be picked up by accident. */
    var TITLE_SELECTORS = [
        "h1.page-title",
        ".pages.show .page-title",
        "h1[data-testid=\"message_title\"]",
        "#assignment_show h1",
        ".assignment-title h1",
        ".assignment-title",
        ".front-page-title",
        "#content h1"
    ];
    var TIMEOUT_MS   = 5000;
    var HIDDEN_CLASS = "monash-visually-hidden-title";
    var INIT_FLAG    = "data-monash-banner-init";

    function findTitleEl() {
        for (var i = 0; i < TITLE_SELECTORS.length; i++) {
            var el = document.querySelector(TITLE_SELECTORS[i]);
            if (el) return el;
        }
        return null;
    }

    function ensureStructure(banner) {
        if (!banner.querySelector(".wcag-page-banner__image")) {
            var imageDiv = document.createElement("div");
            imageDiv.className = "wcag-page-banner__image";
            imageDiv.setAttribute("aria-hidden", "true");
            banner.appendChild(imageDiv);
        }
        if (!banner.querySelector(".wcag-page-banner__title")) {
            var titleDiv = document.createElement("div");
            titleDiv.className = "wcag-page-banner__title";
            titleDiv.setAttribute("aria-hidden", "true");
            banner.appendChild(titleDiv);
        }
    }

    function applyImage(banner) {
        var imgEl = banner.querySelector("img");
        var imageDiv = banner.querySelector(".wcag-page-banner__image");
        if (!imgEl || !imageDiv) return;
        // Hide the source <img> with inline styles (does not rely on class).
        imgEl.style.display = "none";
        imgEl.style.width = "0";
        imgEl.style.height = "0";
        imgEl.style.maxWidth = "0";
        imgEl.style.maxHeight = "0";
        if (imgEl.src) {
            imageDiv.style.backgroundImage = "url('" + imgEl.src + "')";
        }
    }

    function visibleTitleText(el) {
        // Read the heading's VISIBLE text only. The React Discussions UI h1
        // holds a screen-reader-only span ("Discussion Topic: <title>") next to
        // the visible title; textContent would concatenate both and double the
        // title in the overlay. Screen-reader-only elements are clipped to ~1px
        // (never display:none), so anything measuring larger is visible — and
        // clip does not change children's layout size, so this stays correct
        // even when the paired CSS has already sr-hidden the h1 itself. Falls
        // back to full textContent if the visible-only read comes up empty.
        var text = "";
        var nodes = el.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.nodeType === 3) {                       // text node
                text += n.textContent;
            } else if (n.nodeType === 1) {                // element node
                if (n.offsetWidth > 1 || n.offsetHeight > 1) {
                    text += n.textContent;
                }
            }
        }
        text = text.replace(/\s+/g, " ").trim();
        return text || el.textContent.trim();
    }

    function dedupeDiscussionTitle(text) {
        // Belt and braces for the Discussions heading: if the screen-reader
        // duplicate still slipped into the read (it holds "Discussion Topic:
        // <title>" ahead of the visible "<title>", giving
        // "Discussion Topic: XX" patterns), strip the prefix and collapse a
        // back-to-back duplicate. A normal title passes through unchanged.
        var t = text.replace(/^Discussion Topic:\s*/i, "").trim();
        var mid = t.length >> 1;
        var a = t.slice(0, mid).trim();
        if (a && a === t.slice(mid).trim()) return a;       // "XX"
        if (a && a === t.slice(mid + 1).trim()) return a;   // "X X"
        return t;
    }

    function applyTitle(banner) {
        var overlay = banner.querySelector(".wcag-page-banner__title");
        if (!overlay) return;
        var titleEl = findTitleEl();
        var text = titleEl ? visibleTitleText(titleEl) : document.title;
        if (titleEl && titleEl.getAttribute("data-testid") === "message_title") {
            text = dedupeDiscussionTitle(text);
        }

        var span = document.createElement("span");
        span.className = "wcag-page-banner__title-text";
        span.textContent = text;
        overlay.innerHTML = "";
        overlay.appendChild(span);

        if (titleEl) titleEl.classList.add(HIDDEN_CLASS);
    }

    function initBanner(banner) {
        if (banner.getAttribute(INIT_FLAG)) return; // double-init guard
        banner.setAttribute(INIT_FLAG, "1");

        ensureStructure(banner);
        applyImage(banner);

        var titleEl = findTitleEl();
        if (titleEl && titleEl.textContent.trim()) {
            applyTitle(banner);
            return;
        }

        var giveUpTimer;
        var titleObserver = new MutationObserver(function () {
            var el = findTitleEl();
            if (el && el.textContent.trim()) {
                titleObserver.disconnect();
                clearTimeout(giveUpTimer);
                applyTitle(banner);
            }
        });
        titleObserver.observe(document.body, { childList: true, subtree: true });

        giveUpTimer = setTimeout(function () {
            titleObserver.disconnect();
            var overlay = banner.querySelector(".wcag-page-banner__title");
            if (overlay && !overlay.querySelector(".wcag-page-banner__title-text")) {
                var span = document.createElement("span");
                span.className = "wcag-page-banner__title-text";
                span.textContent = document.title;
                overlay.appendChild(span);
            }
        }, TIMEOUT_MS);
    }

    window.MonashTheme.onContent(function () {
        var banner = document.querySelector(".wcag-page-banner");
        if (banner) initBanner(banner);
    });
})();


/* =============================================================================
   6. YOUTUBE PREVIEW LABEL CLEANUP
   Canvas auto-generates a preview anchor (img.media_comment_thumbnail +
   "[Video]" text) next to YouTube URLs. The theme CSS hides the anchor via
   :has(). This handles the one case CSS cannot: a bare "[Video]" text node that
   Canvas places as a sibling OUTSIDE the anchor. Only text nodes whose trimmed
   value is exactly "[Video]" and that follow such an anchor are removed; author
   text links are untouched. Runs through the shared content watcher, so labels
   added after first render are also cleaned.
============================================================================= */
(function () {
    "use strict";

    function removeStrayVideoLabels() {
        var anchors;
        try {
            anchors = document.querySelectorAll("a:has(> img.media_comment_thumbnail)");
        } catch (e) {
            // :has() unsupported — the CSS rule still handles the common case.
            return;
        }
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            var next = anchor.nextSibling;
            if (next && next.nodeType === Node.TEXT_NODE &&
                next.textContent.trim() === "[Video]") {
                next.parentNode.removeChild(next);
            }
        }
    }

    window.MonashTheme.onContent(removeStrayVideoLabels);
})();


/* =============================================================================
   7. INLINE GLOSSARY MODAL
   Span-based centered modal for .wcag-glossary-term triggers. Canvas strips
   <button> from authored content but preserves <span>, so tabindex / role /
   aria-haspopup / aria-expanded are injected at runtime. Term and definition are
   read from data-glossary-term and data-glossary-definition (confirmed against
   the authored Monash markup). One modal is injected once and reused. Closes on
   close-button click, overlay click, or Escape. Focus moves to the close button
   on open and returns to the trigger on close, and the background is made inert
   while open. Triggers are (re)enhanced by the shared content watcher.
============================================================================= */
(function () {
    "use strict";

    var MODAL_ID   = "wcag-glossary-modal";
    var OPEN_CLASS = "wcag-glossary-modal--open";

    var modal = null, titleEl = null, defEl = null, closeBtn = null, activeTrigger = null;

    function enhanceTriggers() {
        var spans = document.querySelectorAll(".wcag-glossary-term");
        for (var i = 0; i < spans.length; i++) {
            var span = spans[i];
            if (span.dataset.glossaryEnhanced) continue; // idempotent guard
            span.dataset.glossaryEnhanced = "1";
            if (!span.getAttribute("tabindex"))       span.setAttribute("tabindex", "0");
            if (!span.getAttribute("role"))           span.setAttribute("role", "button");
            if (!span.getAttribute("aria-haspopup"))  span.setAttribute("aria-haspopup", "dialog");
            if (!span.hasAttribute("aria-expanded"))  span.setAttribute("aria-expanded", "false");
        }
    }

    function buildModal() {
        modal = document.createElement("div");
        modal.id = MODAL_ID;
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "wcag-glossary-modal-title");
        modal.setAttribute("aria-hidden", "true");

        var card = document.createElement("div");
        card.className = "wcag-glossary-card";
        card.addEventListener("click", function (e) { e.stopPropagation(); });

        var header = document.createElement("div");
        header.className = "wcag-glossary-card__header";

        titleEl = document.createElement("p");
        titleEl.id = "wcag-glossary-modal-title";
        titleEl.className = "wcag-glossary-card__title";

        closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "wcag-glossary-card__close";
        closeBtn.setAttribute("aria-label", "Close definition");
        closeBtn.innerHTML = "&#x2715;";
        closeBtn.addEventListener("click", closeModal);

        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        var divider = document.createElement("hr");
        divider.className = "wcag-glossary-card__divider";
        divider.setAttribute("aria-hidden", "true");

        defEl = document.createElement("p");
        defEl.className = "wcag-glossary-card__def";

        card.appendChild(header);
        card.appendChild(divider);
        card.appendChild(defEl);
        modal.appendChild(card);

        modal.addEventListener("click", closeModal);
        document.body.appendChild(modal);
    }

    function openModal(trigger) {
        if (!modal) buildModal();
        titleEl.textContent = trigger.getAttribute("data-glossary-term") || "";
        defEl.textContent   = trigger.getAttribute("data-glossary-definition") || "";
        modal.classList.add(OPEN_CLASS);
        modal.setAttribute("aria-hidden", "false");
        activeTrigger = trigger;
        trigger.setAttribute("aria-expanded", "true");
        closeBtn.focus();                       // focus into the dialog first…
        window.MonashTheme.setBackgroundInert(true); // …then hide the background
    }

    function closeModal() {
        if (!modal || !modal.classList.contains(OPEN_CLASS)) return;
        window.MonashTheme.setBackgroundInert(false);
        var trigger = activeTrigger;
        activeTrigger = null;
        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();                    // return focus before hiding the dialog
        }
        modal.classList.remove(OPEN_CLASS);
        modal.setAttribute("aria-hidden", "true");
    }

    function getFocusable(root) {
        // Focusable elements inside the modal, for the Tab-wrap focus trap.
        return Array.prototype.slice.call(root.querySelectorAll(
            "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
        )).filter(function (el) {
            return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
        });
    }

    function onGlobalKeydown(e) {
        if (!modal || !modal.classList.contains(OPEN_CLASS)) {
            return;
        }
        if (e.key === "Escape") {
            closeModal();
            return;
        }
        // Focus trap: keep Tab within the open modal (WCAG 2.1.2 / 2.4.3).
        if (e.key === "Tab") {
            var focusable = getFocusable(modal);
            if (focusable.length === 0) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function onContentKeydown(e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var trigger = e.target && e.target.closest ? e.target.closest(".wcag-glossary-term") : null;
        if (!trigger) return;
        e.preventDefault();
        openModal(trigger);
    }

    function onContentClick(e) {
        var trigger = e.target && e.target.closest ? e.target.closest(".wcag-glossary-term") : null;
        if (!trigger) return;
        openModal(trigger);
    }

    // Global listeners registered once (guarded against double-load).
    if (!window.__monashGlossaryBound) {
        window.__monashGlossaryBound = true;
        document.addEventListener("keydown", onGlobalKeydown);
        document.addEventListener("click", onContentClick);
        document.addEventListener("keydown", onContentKeydown);
    }

    window.MonashTheme.onContent(enhanceTriggers);
})();
