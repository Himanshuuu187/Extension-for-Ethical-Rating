import streamlit as st

def apply_theme(theme):
    """Applies custom CSS based on selected theme."""
    if theme == "🌚 Dark":
        st.markdown(
            """
            <style>
            body {
                background-color: #0e1117;
                color: #fafafa;
            }
            .stApp {
                background-color: #0e1117;
                color: #fafafa;
            }
            .sidebar .sidebar-content {
                background-color: #1a1d23;
            }
            .stButton>button {
                background-color: #262730;
                color: white;
                border: 1px solid #3b3b4f;
                border-radius: 10px;
            }
            .stButton>button:hover {
                background-color: #3b3b4f;
                color: #00ffcc;
            }
            .stSelectbox, .stRadio, .stSubheader {
                color: white !important;
            }
            </style>
            """,
            unsafe_allow_html=True
        )

    elif theme == "🌞 Light":
        st.markdown(
            """
            <style>
            body {
                background-color: #f5f7fa;
                color: #000000;
            }
            .stApp {
                background-color: #f5f7fa;
                color: #000000;
            }
            .sidebar .sidebar-content {
                background-color: #ffffff;
            }
            .stButton>button {
                background-color: #0078ff;
                color: white;
                border: none;
                border-radius: 10px;
            }
            .stButton>button:hover {
                background-color: #005ec2;
                color: #f1f1f1;
            }
            </style>
            """,
            unsafe_allow_html=True
        )

def sidebar_settings(df):
    st.sidebar.header("⚙️ App Settings")

    # 🎨 Theme Selection
    theme = st.sidebar.radio("Choose Theme", ["🌞 Light", "🌚 Dark"], horizontal=True)
    apply_theme(theme)

    # 🆚 Compare Two Brands
    st.sidebar.subheader("🆚 Compare Two Brands")
    brand1 = st.sidebar.selectbox("Select first brand:", sorted(df['brand'].str.capitalize().unique()))
    brand2 = st.sidebar.selectbox("Select second brand:", sorted(df['brand'].str.capitalize().unique()))

    # Add a nice divider for visual touch
    st.sidebar.markdown("---")

    return theme, brand1, brand2
