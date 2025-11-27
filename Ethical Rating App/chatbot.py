import streamlit as st

def ethical_chatbot(df, user_query):
    if user_query.strip() == "":
        st.warning("Please type a question.")
        return

    query_lower = user_query.lower()
    reply = "🤖 "
    brand_detected = None
    for b in df['brand']:
        if b in query_lower:
            brand_detected = b
            break

    if brand_detected:
        brand_info = df[df['brand'] == brand_detected].iloc[0]
        score = brand_info['ethical_score']
        if score >= 80:
            reply += f"{brand_detected.capitalize()} is performing very well ethically 🌿 with a score of {score}/100."
        elif score >= 60:
            reply += f"{brand_detected.capitalize()} is decent (score: {score}/100) but can improve sustainability transparency."
        else:
            reply += f"{brand_detected.capitalize()} needs to work on labor welfare and environmental practices (score: {score}/100)."
    elif "improve" in query_lower:
        reply += "Brands can improve by using renewable resources, ensuring fair wages, and publishing sustainability audits."
    elif "sustainability" in query_lower:
        reply += "Sustainability means balancing planet, people, and profit — reducing waste and promoting eco-friendly production."
    elif "best" in query_lower or "top" in query_lower:
        top_brands = df.sort_values("ethical_score", ascending=False).head(5)
        reply += "Here are the top ethical brands:\n"
        for i, row in top_brands.iterrows():
            reply += f"🌱 {row['brand'].capitalize()} ({row['ethical_score']}/100)\n"
    else:
        reply += "Ethical ratings are based on CSR, sustainability, and environmental policies."

    st.info(reply)
