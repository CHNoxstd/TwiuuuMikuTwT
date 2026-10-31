const initLanguagePicker = () => {
  const languagePicker = document.querySelector("[data-language-picker]");
  if (!languagePicker) return;

  const scriptUrl = new URL(document.currentScript?.src || document.querySelector('script[src*="locale-switcher.js"]')?.src);
  const siteRoot = new URL("../", scriptUrl);
  const relativePath = window.location.pathname.startsWith(siteRoot.pathname)
    ? window.location.pathname.slice(siteRoot.pathname.length)
    : "";
  const localeMatch = relativePath.match(/^(zh_cn|mn|ro|ja)(?:\/(.*))?$/);
  const pagePath = localeMatch?.[2] || relativePath;
  const currentPage = pagePath.startsWith("publication/")
    ? "chapters.html"
    : pagePath === "lab-portal/index.html"
      ? "index.html"
      : pagePath === "lab-portal/more-html/field-guide.html"
        ? "field-notes.html"
        : ["science.html", "research.html", "field-notes.html"].includes(pagePath)
          ? pagePath
          : "index.html";

  languagePicker.value = localeMatch?.[1] || "en";
  languagePicker.addEventListener("change", () => {
    const locale = languagePicker.value;
    const targetPath = locale === "en"
      ? currentPage === "chapters.html" ? "publication/index.html" : currentPage === "lab.html" ? "lab-portal/index.html" : currentPage
      : `${locale}/${currentPage === "index.html" ? "" : currentPage}`;
    window.location.assign(new URL(targetPath, siteRoot));
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguagePicker, { once: true });
} else {
  initLanguagePicker();
}
