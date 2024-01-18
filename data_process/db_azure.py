import requests
import pyodbc


def get_public_ip():
    try:
        # Use a service that echoes back the client's public IP address
        response = requests.get('https://api64.ipify.org?format=json')
        print("hello")
        if response.status_code == 200:
            ip_address = response.json()['ip']
            return ip_address
        else:
            print(f"Failed to retrieve IP address. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    public_ip = get_public_ip()
    if public_ip:
        print(f"Your public IP address is: {public_ip}")



server = 'michelserver.database.windows.net'
database = 'micheldb'
username = 'michel'
password = '{Louis1901!}'
driver= '{ODBC Driver 18 for SQL Server}'

with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
    with conn.cursor() as cursor:
        cursor.execute("SELECT TOP 3 name, collation_name FROM sys.databases")
        row = cursor.fetchone()
        while row:
            print (str(row[0]) + " " + str(row[1]))
            row = cursor.fetchone()



