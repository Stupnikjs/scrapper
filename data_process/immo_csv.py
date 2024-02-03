import pandas as pd 

df = pd.read_csv('output.csv')



df['price_per_m'] = df['price_per_m'].str[:-4]
df['price'] = df['price'].str[:-2]
df['postal_code'] = df['adress'].str[:5]
df['location'] = df['adress'].str[5:]
df['type'] = df['title'].str.split().str[0]
df['area'] = df['title'].str.split().str[-2]
df['room'] = df['title'].str.split().str[-4]
df = df.drop(columns=['title', 'adress'])



df.to_csv('cleaned.csv')

