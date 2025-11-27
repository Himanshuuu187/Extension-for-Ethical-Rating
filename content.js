// content.js
// Ethical Shopping Advisor – Final Improved Version (with demo fallback + dynamic URL support)

(function () {
  console.log("Ethical Advisor: Script loaded ✅");

  // Run analyzer initially and when URL changes dynamically (Amazon/Flipkart use AJAX navigation)
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      analyzePage();
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  analyzePage();

  async function analyzePage() {
    try {
      await new Promise(r => setTimeout(r, 1500)); // Wait for elements to load
      const domain = location.hostname;
      let product = null;

      console.log("Ethical Advisor: Checking domain", domain);

      if (/amazon\./i.test(domain)) product = extractAmazon();
      else if (/flipkart\./i.test(domain)) product = extractFlipkart();
      else product = extractGeneric();

      console.log("Ethical Advisor: Product extracted", product);

      // If no product found, show demo card instead of returning silently
      if (!product || !product.name) {
        console.warn("Ethical Advisor: No product info found — showing demo card");
        showFloatingCard({
          product: { name: "Demo Product", price: "₹999", rating: "4.5★" },
          brandName: "Nike",
          brandInfo: {
            grade: "A",
            categories: ["Sustainability", "Fair Trade"],
            notes: "Demo display for testing on non-product pages."
          }
        });
        return;
      }

      const brandName = (product.brand || detectBrandFromTitle(product.name) || "Unknown").trim();

      const ethicalDataURL = chrome.runtime.getURL("ethical_data.json");
      const resp = await fetch(ethicalDataURL);
      const ethicalData = await resp.json();
      const brandInfo = ethicalData[brandName.toLowerCase()] || null;

      console.log("Ethical Advisor: Brand match", brandName, brandInfo);
      showFloatingCard({ product, brandName, brandInfo });

      // Cache data
      chrome.runtime.sendMessage({
        type: "CACHE_BRAND",
        brand: brandName,
        info: brandInfo || { grade: "No Data" }
      });
    } catch (err) {
      console.error("Ethical Advisor Error:", err);
    }
  }

  // --- Domain-specific extractors ---
  function extractAmazon() {
    const name =
      (document.querySelector('#productTitle') ||
        document.querySelector('#title') ||
        document.querySelector('h1 span') || {}).innerText || "";

    const price =
      (document.querySelector('#priceblock_ourprice') ||
        document.querySelector('#priceblock_dealprice') ||
        document.querySelector('.a-price .a-offscreen') || {}).innerText || "";

    const rating =
      (document.querySelector('span[data-hook="rating-out-of-text"]') ||
        document.querySelector('i.a-icon-star span') || {}).innerText || "";

    let brand = "";
    const brandEl = document.querySelector('#bylineInfo') ||
      document.querySelector('#brand') ||
      document.querySelector('#bylineInfo_feature_div a');
    if (brandEl) brand = brandEl.innerText;

    return { name: name.trim(), price: price.trim(), brand: brand.trim(), rating: rating.trim(), source: 'amazon' };
  }

  function extractFlipkart() {
    const name =
      (document.querySelector('span.B_NuCI') ||
        document.querySelector('._35KyD6') || {}).innerText || "";

    const price =
      (document.querySelector('div._30jeq3._16Jk6d') ||
        document.querySelector('div._30jeq3') || {}).innerText || "";

    const rating =
      (document.querySelector('div._3LWZlK') ||
        document.querySelector('._2d4LTz') || {}).innerText || "";

    let brand = "";
    const metaBrand = document.querySelector('meta[name="og:brand"]');
    if (metaBrand) brand = metaBrand.content;
    else {
      const brandHint = document.querySelector('a.IRpwTa');
      if (brandHint) brand = brandHint.innerText;
    }

    return { name: name.trim(), price: price.trim(), brand: brand.trim(), rating: rating.trim(), source: 'flipkart' };
  }

  function extractGeneric() {
    const name = document.title || "";
    const price =
      document.querySelector('meta[property="product:price:amount"]')?.content || "";
    const brand =
      document.querySelector('meta[name="brand"]')?.content || "";
    const rating =
      document.querySelector('meta[name="rating"]')?.content || "";

    return { name: name.trim(), price: price.trim(), brand: brand.trim(), rating: rating.trim(), source: 'generic' };
  }

  // --- Helpers ---
  function detectBrandFromTitle(title) {
    if (!title) return "";
    const words = title.split(" ");
    return words[0];
  }

  function gradeColor(grade) {
    if (!grade) return "#9aa0a6";
    switch (grade.toUpperCase()) {
      case "A": return "#16a34a";
      case "B": return "#22c55e";
      case "C": return "#f59e0b";
      case "D": return "#f97316";
      case "E": return "#ef4444";
      default: return "#9aa0a6";
    }
  }

  // --- Floating card builder ---
  function showFloatingCard({ product, brandName, brandInfo }) {
    const existing = document.getElementById("ethical-advisor-card");
    if (existing) existing.remove();

    const card = document.createElement("div");
    card.id = "ethical-advisor-card";
    card.className = "ethical-card";
    card.style.cssText = `
      position:fixed;
      right:20px;
      bottom:20px;
      width:320px;
      background:#fff;
      border-radius:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.15);
      font-family:Arial,sans-serif;
      padding:12px;
      z-index:999999;
      transition:all 0.3s ease;
    `;

    const gradeText = brandInfo?.grade || "No Data";
    const color = gradeColor(gradeText);

    card.innerHTML = `
      <div style="font-weight:700;margin-bottom:6px;">${product.name}</div>
      <div><strong>Brand:</strong> ${brandName}</div>
      <div><strong>Price:</strong> ${product.price || "N/A"}</div>
      <div><strong>Product Rating:</strong> ${product.rating || "N/A"}</div>
      <div style="margin-top:6px;">
        <strong>Ethical Grade:</strong>
        <span style="background:${color};color:#fff;padding:3px 8px;border-radius:8px;font-weight:600;">
          ${gradeText}
        </span>
      </div>
      <div style="font-size:13px;margin-top:6px;color:#333;">
        ${brandInfo
          ? `<b>Categories:</b> ${brandInfo.categories.join(", ")}<br><b>Notes:</b> ${brandInfo.notes}`
          : `<em>No ethical data available.</em>`}
      </div>
    `;

    document.body.appendChild(card);
    console.log("Ethical Advisor: Floating card shown ✅");
  }
})();
