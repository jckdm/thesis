import sqlite3 as SQL
from csv import writer

def main():
    connection = SQL.connect('jackadam-1440-900-.db')
    db = connection.cursor()

    apps = db.execute("SELECT app, time FROM data;").fetchall()
    last = None

    with open('jackadam-1440-900-' + 'reader-.csv', 'w') as out:
        w = writer(out)
        w.writerow(['app', 'time'])
        for app in apps:
            if app[0] != last:
                w.writerow([app[0], app[1]])
                last = app[0]

if __name__ == '__main__':
    main()
