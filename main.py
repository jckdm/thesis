from datetime     import datetime
from AppKit       import NSWorkspace
from pynput.mouse import Controller
from getpass      import getuser
from tkinter      import Tk
from json         import dump
from time         import sleep
import sqlite3    as SQL
connection = SQL.connect('data.db')

def record():
    # record date & time
    dt = datetime.now()
    date = dt.strftime('%m/%d/%Y')
    time = dt.strftime('%H:%M:%S')
    # record active application
    a = NSWorkspace.sharedWorkspace().activeApplication()
    app = a['NSApplicationName']
    # record process ID
    pid = a['NSApplicationProcessIdentifier']
    # record mouse coordinates
    m = Controller().position

    # return array of dictionary & array with equivalent data
    return [
        { 'date': date, 'time': time, 'app': app, 'pid': pid, 'x': m[0], 'y': m[1] },
        [date, time, app, pid, m[0], m[1]]
    ]

def main():
    # get user's name
    user = getuser()
    # get screen width & height
    width = Tk().winfo_screenwidth()
    height = Tk().winfo_screenheight()

    # dictionary with user info & data array
    obj = { 'user': user, 'width': width, 'height': height, 'data': [] }

    # connect to DB and create table for user info
    db = connection.cursor()
    db.execute("CREATE TABLE IF NOT EXISTS info (user TEXT, width NUMERIC, height NUMERIC);")
    db.execute("INSERT INTO info (user, width, height) VALUES (?, ?, ?);", [user, width, height])

    # create table for data
    db.execute("CREATE TABLE IF NOT EXISTS data (date TEXT, time NUMERIC, app TEXT, pid NUMERIC, x REAL, y REAL);")

    # open JSON file for writing
    with open('log.json', 'w') as log:
        while True:
            # record data and insert into data table
            entry = record()
            db.execute("INSERT INTO data (date, time, app, pid, x, y) VALUES (?, ?, ?, ?, ?, ?);", entry[1])
            connection.commit()
            # write data to JSON file
            # append new data (inside dictionary) to data array
            obj['data'].append(entry[0])
            # seek back to beginning of file
            log.seek(0)
            # overwrite entire JSON file
            dump(obj, log, indent=2)
            # pause for 1 second
            sleep(1)

if __name__ == '__main__':
    main()
