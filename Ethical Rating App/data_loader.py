import pandas as pd
import streamlit as st

@st.cache_data
def load_dataset():
   
    df = pd.read_csv("brand_rating.csv")
    df['brand'] = df['brand'].str.lower()
    return df
