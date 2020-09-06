from getpass  import getuser
from tkinter  import Tk
from datetime import datetime
from time     import sleep
# from json     import dumps
import csv

def main():
    user = getuser()
    w, h = Tk().winfo_screenwidth(), Tk().winfo_screenheight()

    with open('log.csv', 'w') as csvfile:
        print(f"Hello {user}! Don't mind me; I'll be watching your {w} by {h} screen.\n{exit}")
        writer = csv.writer(csvfile)
        writer.writerow(['date', 'time'])
        while True:
            dt = datetime.now()
            d = dt.strftime('%m/%d/%Y')
            t = dt.strftime('%H:%M:%S')
            writer.writerow([d, t])
            sleep(1)

if __name__ == '__main__':
    main()

# with open('log.json', 'w') as outfile:
#     outfile.write(dumps(specs))
#     while True:
#         dt = datetime.now()
#         t = {
#             'date': dt.strftime('%m/%d/%Y'),
#             'time': dt.strftime('%H:%M:%S')
#         }
#         outfile.write(dumps(t))
#         sleep(1)
