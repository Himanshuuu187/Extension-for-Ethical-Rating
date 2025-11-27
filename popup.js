// popup.js — Analyze product via pasted URL
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('checkBtn');
  const input = document.getElementById('urlInput');
  const result = document.getElementById('result');

  btn.addEventListener('click', async () => {
    const url = input.value.trim();
    if (!url) {
      result.innerHTML = "<span style='color:red;'>⚠️ Please paste a product URL.</span>";
      return;
    }

    result.innerHTML = "⏳ Fetching product details...";

    try {
      const ethicalDataURL = chrome.runtime.getURL('ethical_data.json');
      const ethicalData = await fetch(ethicalDataURL).then(r => r.json());

      const html = await fetch(url).then(r => r.text());
      const doc = new DOMParser().parseFromString(html, 'text/html');

      let product = {};
      if (/amazon\./i.test(url)) {
        product.name = doc.querySelector('#productTitle')?.innerText?.trim() || "";
        product.price = doc.querySelector('.a-price .a-offscreen')?.innerText?.trim() || "";
        product.brand = doc.querySelector('#bylineInfo')?.innerText?.trim() || "";
        product.rating = doc.querySelector('span[data-hook="rating-out-of-text"]')?.innerText?.trim() || "";
      } else if (/flipkart\./i.test(url)) {
        product.name = doc.querySelector('span.B_NuCI')?.innerText?.trim() || "";
        product.price = doc.querySelector('div._30jeq3._16Jk6d')?.innerText?.trim() || "";
        product.brand = doc.querySelector('a.IRpwTa')?.innerText?.trim() || "";
        product.rating = doc.querySelector('div._3LWZlK')?.innerText?.trim() || "";
      }

      if (!product.name) throw new Error("No product info found");

      const brandKey = product.brand?.toLowerCase() || product.name.split(" ")[0].toLowerCase();
      const brandInfo = ethicalData[brandKey] || { grade: "No Data", categories: [], notes: "Not in ethical DB." };

      // Display in popup
      const color = gradeColor(brandInfo.grade);
      result.innerHTML = `
        <b>${product.name}</b><br>
        Brand: ${product.brand || "Unknown"}<br>
        Price: ${product.price || "N/A"}<br>
        Rating: ${product.rating || "N/A"}<br>
        Ethical Grade: <span style="background:${color};color:#fff;padding:2px 6px;border-radius:6px;">${brandInfo.grade}</span><br>
        <small>${brandInfo.notes}</small>
      `;

      // Inject floating card into current tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: showCard,
          args: [product, brandInfo]
        });
      });
    } catch (err) {
      console.error(err);
      result.innerHTML = "<span style='color:red;'>❌ Failed to extract product info.</span>";
    }
  });

  function gradeColor(g) {
    switch ((g || "").toUpperCase()) {
      case "A": return "#16a34a";
      case "B": return "#22c55e";
      case "C": return "#f59e0b";
      case "D": return "#f97316";
      case "E": return "#ef4444";
      default: return "#9aa0a6";
    }
  }

  // Injects floating card into page
  function showCard(product, brandInfo) {
    const existing = document.getElementById("ethical-advisor-card");
    if (existing) existing.remove();

    const color = (() => {
      switch ((brandInfo.grade || "").toUpperCase()) {
        case "A": return "#16a34a";
        case "B": return "#22c55e";
        case "C": return "#f59e0b";
        case "D": return "#f97316";
        case "E": return "#ef4444";
        default: return "#9aa0a6";
      }
    })();

    const card = document.createElement("div");
    card.id = "ethical-advisor-card";
    card.style.cssText = `
      position:fixed;right:20px;bottom:20px;width:320px;
      background:#fff;border-radius:10px;padding:12px;
      box-shadow:0 8px 24px rgba(0,0,0,0.15);
      font-family:Arial,sans-serif;z-index:999999;
    `;
    card.innerHTML = `
      <div style="font-weight:700;margin-bottom:6px;">${product.name}</div>
      <div><strong>Brand:</strong> ${product.brand || "Unknown"}</div>
      <div><strong>Price:</strong> ${product.price || "N/A"}</div>
      <div><strong>Rating:</strong> ${product.rating || "N/A"}</div>
      <div style="margin-top:6px;"><strong>Ethical Grade:</strong>
        <span style="background:${color};color:#fff;padding:3px 8px;border-radius:8px;font-weight:600;">
          ${brandInfo.grade}
        </span>
      </div>
      <div style="font-size:13px;margin-top:6px;color:#333;">
        ${brandInfo.notes}
      </div>
    `;
    document.body.appendChild(card);
  }
});
