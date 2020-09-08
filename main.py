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
    dt = datetime.now()
    a = NSWorkspace.sharedWorkspace().activeApplication()
    app = a['NSApplicationName']
    pid = a['NSApplicationProcessIdentifier']
    m = Controller().position
    date = dt.strftime('%m/%d/%Y')
    time = dt.strftime('%H:%M:%S')

    return [
        { 'date': date, 'time': time, 'app': app, 'pid': pid, 'x': m[0], 'y': m[1] },
        [date, time, app, pid, m[0], m[1]]
    ]

def main():
    user = getuser()
    width = Tk().winfo_screenwidth()
    height = Tk().winfo_screenheight()

    obj = { 'user': user, 'width': width, 'height': height, 'data': [] }

    db = connection.cursor()
    db.execute("CREATE TABLE IF NOT EXISTS info (user TEXT, width NUMERIC, height NUMERIC);")
    db.execute("INSERT INTO info (user, width, height) VALUES (?, ?, ?);", [user, width, height])

    db.execute("CREATE TABLE IF NOT EXISTS data (date TEXT, time NUMERIC, app TEXT, pid NUMERIC, x REAL, y REAL);")

    with open('log.json', 'w') as log:
        while True:
            entry = record()
            db.execute("INSERT INTO data (date, time, app, pid, x, y) VALUES (?, ?, ?, ?, ?, ?);", entry[1])
            connection.commit()
            obj['data'].append(entry[0])
            log.seek(0)
            dump(obj, log, indent=2)
            sleep(1)

if __name__ == '__main__':
    main()
