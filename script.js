"use strict";
const body = document.body;
const loadingCaption = document.getElementById("loadingCaption");
function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}
async function openStorybook() {
    try {
        await wait(250);
        body.classList.add("is-ready");
        await wait(950);
        body.classList.add("is-opening");
        await wait(1250);
        body.classList.add("is-open");
        await wait(1800);
        if (loadingCaption) {
            loadingCaption.setAttribute("aria-hidden", "true");
        }
    } catch (error) {
        console.error("Could not open the storybook:", error);
        body.classList.add("is-ready", "is-opening", "is-open");
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", openStorybook, {
        once: true
    });
} else {
    openStorybook();
}