import sqlite3
import csv

# connect to the database
conn = sqlite3.connect('tornado10ColP3.sqlite')

# create a new table
cursor = conn.cursor()
cursor.execute('''CREATE TABLE tornado_table2 (yr INTEGER, mo INTEGER, st TEXT, mag INTEGER, inj INTEGER, fat INTEGER, slat INTEGER, slon INTEGER, len INTEGER, wid INTEGER);''')

# import data from CSV file
with open('1950-2021_torn.csv', 'r') as file:
    reader = csv.reader(file)

    # skip the header row
    next(reader)
    for row in reader:
        # extract the values from the row and convert to the appropriate data types
        yr = int(row[1])
        mo = int(row[2])
        st = row[6]
        mag = int(row[10])
        inj = int(row[11])
        fat = int(row[12])
        slat = float(row[15])
        slon = float(row[16])
        len = str(row[19])
        wid = int(row[20])

        # insert the values into the table
        cursor.execute('''INSERT INTO tornado_table2 (yr, mo, st, mag, inj, fat, slat, slon, len, wid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);''', (yr, mo, st, mag, inj, fat, slat, slon, len, wid))

# commit changes and close the connection
conn.commit()
conn.close()
