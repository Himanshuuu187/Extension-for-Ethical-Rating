import streamlit as st

def leaderboard(df):
    st.subheader("🏆 Top 10 Ethical Brands Leaderboard")
    top_brands = df.sort_values("ethical_score", ascending=False).head(10)
    st.dataframe(top_brands[['brand', 'ethical_score', 'category']], use_container_width=True)

def brand_comparison(df, brand1, brand2):
    st.subheader("🆚 Brand Comparison Insights")
    b1 = df[df['brand'] == brand1.lower()].iloc[0]
    b2 = df[df['brand'] == brand2.lower()].iloc[0]

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f"### 🌿 {brand1}")
        st.metric("Ethical Score", f"{b1['ethical_score']}/100")
        st.write(f"**Category:** {b1['category']}")
        st.write(f"**Source:** {b1['source']}")

    with col2:
        st.markdown(f"### 🌿 {brand2}")
        st.metric("Ethical Score", f"{b2['ethical_score']}/100")
        st.write(f"**Category:** {b2['category']}")
        st.write(f"**Source:** {b2['source']}")

def footer():
    st.markdown(
        """
        <p style='text-align:center; font-size:14px; color:gray'>
        Built with 💚 using Streamlit | Brand Comparison • Sentiment Feedback • AI Chatbot • Leaderboard
        </p>
        """,
        unsafe_allow_html=True
    )
