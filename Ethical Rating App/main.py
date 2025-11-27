import streamlit as st
from data_loader import load_dataset
from lottie_loader import load_lottieurl
from ui_settings import sidebar_settings
from brand_analysis import analyze_brand
from chatbot import ethical_chatbot
from utils import leaderboard, brand_comparison, footer




st.title("🪴 Ethical Brand Rating Dashboard")
st.write("Analyze ethical ratings, compare brands, view trends, and chat with our sustainability bot!")


df = load_dataset()

lotties = {
    "green": load_lottieurl("https://lottie.host/1c4b7a77-6760-4d33-9c74-f8b0538d5c9b/Sk9zWcbLwG.json"),
    "medium": load_lottieurl("https://lottie.host/f01732b4-0df0-49d2-b47a-b8e7c810ff14/XXQ9eHz2rE.json"),
    "low": load_lottieurl("https://lottie.host/5f5b65f6-d64e-4987-b512-94f9b292c6d2/xmabQvQrF1.json")
}


theme, brand1, brand2 = sidebar_settings(df)


product_url = st.text_input("Paste an Amazon or Flipkart product URL:")

if st.button("Check Ethical Rating"):
    analyze_brand(df, product_url, lotties)

st.divider()
leaderboard(df)

st.divider()
brand_comparison(df, brand1, brand2)

st.divider()
st.subheader("💬 Ethical AI Assistant 🤖")
user_query = st.text_input("Ask me about any brand or ethical topic:")
if st.button("Ask Assistant"):
    ethical_chatbot(df, user_query)

st.divider()
footer()
