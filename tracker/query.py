import sqlite3 as SQL
from csv       import writer

def main():
    connection = SQL.connect('../data/jackadam-1440-900-.db', isolation_level = None)
    db = connection.cursor()

    apps = db.execute("SELECT DISTINCT app FROM data;").fetchall()
    # before = db.execute("SELECT COUNT(*) FROM data").fetchall()
    # print(apps)
    sum = 0
    data = {}

    for app in apps:
        a = app[0]
        count = db.execute("SELECT COUNT(*) FROM data WHERE app = ?;", [a]).fetchall()
        c = int(count[0][0])
        sum += c
        data[a] = c

    smallest = []

    for key, val in data.items():
        percent = (val / sum) * 100.0
        if percent < 0.3:
            smallest.append(key)

    for app in smallest:
        db.execute("DELETE FROM data WHERE app = ?;", [app])

    # print(smallest)

    apps = db.execute("SELECT DISTINCT app FROM data;").fetchall()
    for app in apps:
        row = db.execute("SELECT app, x, y from DATA where app = ?;",[app[0]]).fetchall()
        with open(str(app[0]) + '.csv', 'w', newline='') as out:
            w = writer(out)
            w.writerow([i[0] for i in db.description])
            w.writerows(row)

    # db.execute("SELECT * from data;")
    # with open('out.csv', 'w', newline='') as out:
    #     w = writer(out)
    #     w.writerow([i[0] for i in db.description])
    #     w.writerows(db)


if __name__ == '__main__':
    main()
