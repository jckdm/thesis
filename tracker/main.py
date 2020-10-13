from datetime     import datetime
from AppKit       import NSWorkspace
from pynput.mouse import Controller
from sys          import exit
from getpass      import getuser
from tkinter      import Tk
from csv          import writer
from os           import stat
from time         import sleep
import sqlite3    as SQL

def record():
    # record date & time
    dt = datetime.now()
    date = dt.strftime('%m/%d/%Y')
    time = dt.strftime('%H:%M:%S')

    # record mouse coordinates
    m = Controller().position

    try:
        # record active application
        a = NSWorkspace.sharedWorkspace().activeApplication()
        app = a['NSApplicationName']
        # record process ID
        pid = a['NSApplicationProcessIdentifier']
    except TypeError:
        print('\nYou no longer have any active applications! Goodnight.')

    return [date, time, app, pid, m[0], m[1]]


def main():
    # get user's name
    user = getuser()
    # get screen width & height
    width = Tk().winfo_screenwidth()
    height = Tk().winfo_screenheight()

    # name of files is username + screen size
    filename = user + '-' + str(width) + '-' + str(height) + '-'

    # connect to DB and create table for user info, with autocommitting
    connection = SQL.connect(filename + '.db', isolation_level = None)
    db = connection.cursor()

    # create table for user info
    db.execute("CREATE TABLE IF NOT EXISTS info (user TEXT, width NUMERIC, height NUMERIC);")

    if not (db.execute("SELECT * FROM info WHERE user = ?;", [user]).fetchall()):
        db.execute("INSERT INTO info (user, width, height) VALUES (?, ?, ?);", [user, width, height])

    # create table for data
    db.execute("CREATE TABLE IF NOT EXISTS data (date TEXT, time TEXT, app TEXT, pid NUMERIC, x REAL, y REAL);")

    print('Please type Ctrl+C to quit.')

    # open CSV file for appending, buffer = 1 line
    with open(filename + '.csv', 'a', 1) as log:
        wr = writer(log)

        # only write header if file is empty
        if stat(filename + '.csv').st_size == 0:
            wr.writerow(['date', 'time', 'app', 'pid', 'x', 'y'])

        try:
            while True:
                # record data and insert into db
                entry = record()
                db.execute("INSERT INTO data (date, time, app, pid, x, y) VALUES (?, ?, ?, ?, ?, ?);", entry)
                # write data to CSV file
                wr.writerow(entry)
                # pause for 1 second
                sleep(1)
        except KeyboardInterrupt:
            print('\nThanks for letting me collect your data!')
        else:
            print('\nAn unexpected error occurred.')

if __name__ == '__main__':
    main()
