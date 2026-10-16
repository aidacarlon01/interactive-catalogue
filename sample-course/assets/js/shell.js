/* Sample course shell: the course-menu toggle (Canvas hamburger).
   Desktop: collapses/expands the course nav. Small screens: opens/closes it. */
(function () {
    "use strict";
    var btn = document.querySelector(".nav-toggle");
    if (!btn) return;
    var mq = window.matchMedia("(max-width: 900px)");

    function isVisible() {
        return mq.matches
            ? document.body.classList.contains("course-nav-open")
            : !document.body.classList.contains("course-nav-collapsed");
    }
    function sync() { btn.setAttribute("aria-expanded", isVisible() ? "true" : "false"); }

    btn.addEventListener("click", function () {
        if (mq.matches) {
            document.body.classList.toggle("course-nav-open");
        } else {
            document.body.classList.toggle("course-nav-collapsed");
        }
        sync();
    });
    if (mq.addEventListener) mq.addEventListener("change", sync);
    sync();
})();
