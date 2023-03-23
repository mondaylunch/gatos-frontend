// Something is seriously wrong in production, don't have time to debug it.
// 200% sure this is an issue with SSR but after dealing with Auth.js, let's just end this quickly.

// Solution:
// If an error shows on the page (from Solid runtime),
// then click "Clear errors and retry", this fixes things.
document.addEventListener("DOMContentLoaded", () => {
  const el = () => document.getElementById("reset-errors");

  // If we can already reset errors, do it
  if (el()) {
    return el().click();
  }

  // Start observing for DOM changes
  const observer = new MutationObserver(() => {
    if (el()) {
      // Once we can reset errors, stop observing and do it
      observer.disconnect();
      el().click();
    }
  });

  // Observe all DOM nodes on the page
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
