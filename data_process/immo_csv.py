import pandas as pd 

def my_split(x): 
    return x.split(' ')[0]


df = pd.read_csv('output.csv')

df['postal_code'] = df['adress'].apply(my_split)

print(df.head())