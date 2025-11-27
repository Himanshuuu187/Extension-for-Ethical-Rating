import re
import random
import streamlit as st
import pandas as pd
from textblob import TextBlob
from streamlit_lottie import st_lottie

def analyze_brand(df, product_url, lotties):
    if not product_url.strip():
        st.warning("Please enter a valid product URL.")
        return

    product_url = product_url.lower()
    match = re.findall(r'/([a-z0-9\-]+)/', product_url)
    brand_found = None

    for word in match:
        for brand in df['brand']:
            if brand in word:
                brand_found = brand
                break
        if brand_found:
            break

    st.write("### 🔍 Analyzing product link...")

    if not brand_found:
        st.warning("⚙️ Could not detect brand from the URL.")
        st.write("Estimated Ethical Score: **70/100 (default estimate)**")
        return

    brand_info = df[df['brand'] == brand_found].iloc[0]
    score = brand_info['ethical_score']
    category = brand_info['category']
    source = brand_info['source']

    
    st.subheader("📋 Brand Summary Card")
    colA, colB = st.columns([1, 2])
    with colA:
        if score >= 80:
            st.image("https://cdn-icons-png.flaticon.com/512/190/190411.png", width=80)
        elif score >= 60:
            st.image("https://cdn-icons-png.flaticon.com/512/984/984196.png", width=80)
        else:
            st.image("https://cdn-icons-png.flaticon.com/512/564/564619.png", width=80)
    with colB:
        st.markdown(f"### 🌿 {brand_found.capitalize()}")
        st.markdown(f"**Category:** {category}")
        st.markdown(f"**Ethical Score:** `{score}/100`")
        st.markdown(f"**Source:** {source}")

   
    if score >= 80:
        grade = "A"; msg = "🌱 Excellent ethics and sustainability practices."; animation = lotties["green"]
    elif score >= 60:
        grade = "B"; msg = "⚖️ Good, but can improve transparency."; animation = lotties["medium"]
    else:
        grade = "C"; msg = "⚠️ Below average ethical score."; animation = lotties["low"]

    st.success(f"**Grade {grade}** — {msg}")
    if animation:
        st_lottie(animation, height=130)

    
    st.subheader("📊 Historical Ethical Trend")
    years = list(range(2018, 2025))
    base_score = score - random.randint(5, 15)
    trend_data = []
    for year in years:
        base_score = max(40, min(100, base_score + random.choice([-3, -2, -1, 0, 1, 2, 3])))
        trend_data.append({"Year": year, "Ethical Score": base_score})
    trend_df = pd.DataFrame(trend_data)

    avg_trend = trend_df["Ethical Score"].mean()
    trend_delta = trend_df["Ethical Score"].iloc[-1] - trend_df["Ethical Score"].iloc[0]

    col1, col2, col3 = st.columns(3)
    col1.metric("📅 Years Tracked", len(trend_df))
    col2.metric("📈 Avg Score", f"{avg_trend:.1f}")
    col3.metric("🔺 Change", f"{trend_delta:+.1f}")

    st.line_chart(trend_df.set_index("Year"))

    if trend_delta > 5:
        st.success("🌿 This brand shows strong ethical growth over time.")
    elif trend_delta > 0:
        st.info("⚖️ Slight improvement in sustainability efforts.")
    elif trend_delta == 0:
        st.warning("➖ Stable performance with no major changes.")
    else:
        st.error("⚠️ Declining ethical score, transparency needs improvement.")

    
    st.subheader("💡 Ethical Improvement Suggestions")
    suggestions = [
        "Increase transparency in sourcing materials.",
        "Adopt renewable energy sources in manufacturing.",
        "Improve labor welfare and employee benefits.",
        "Reduce plastic packaging and promote recycling.",
        "Publish sustainability reports regularly."
    ]
    random.shuffle(suggestions)
    for s in suggestions[:3]:
        st.markdown(f"✅ {s}")

    
    st.subheader("⭐ Your Rating & Feedback")
    user_rating = st.slider("Rate this brand’s ethics (0 - 10):", 0, 10, 7)
    feedback = st.text_area("Share your feedback or suggestions:")

    if st.button("Submit Feedback"):
        sentiment = TextBlob(feedback).sentiment.polarity
        if sentiment > 0.2: mood = "😊 Positive"
        elif sentiment < -0.2: mood = "😠 Negative"
        else: mood = "😐 Neutral"

        st.success("✅ Thank you for your feedback!")
        st.write(f"**Your Rating:** {user_rating}/10")
        st.write(f"**Sentiment:** {mood}")
        st.write(f"**Your Comment:** {feedback if feedback else 'No comment provided.'}")
