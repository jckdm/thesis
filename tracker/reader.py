from os        import path
from glob      import glob
import sqlite3 as SQL
from csv       import writer

def main():
    # get path to file
    filepath = input('Path to .csv file (blank if PWD): ')

    # check if valid path
    if filepath != '':
        if not path.isdir(filepath) and not path.isfile(filepath):
            exit('Invalid file/path')

    files = []

    # if PWD
    if filepath == '':
        # read all files in PWD
        for file in glob(filepath + '*.csv'):
            files.append(file[:-4])
    # if direct path
    elif filepath[:-4] == '.csv':
        files.append(filepath[:-4])

    # list still empty
    if not files:
        exit("Sorry, I didn't find any .csv files in this directory.")

    # open each corresponding DB
    for file in files:
        if path.isfile(file + '.db'):
            connection = SQL.connect(file + '.db')
            db = connection.cursor()

            apps = db.execute("SELECT app, time FROM data;").fetchall()
            last = None

            with open(file + 'reader-.csv', 'w') as out:
                w = writer(out)
                w.writerow(['app', 'time'])
                for app in apps:
                    curr = app[0]
                    # if current app != last app seen
                    if curr != last:
                        # record app and time
                        w.writerow([curr, app[1]])
                        last = curr

if __name__ == '__main__':
    main()
