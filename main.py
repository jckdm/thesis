from getpass  import getuser
from tkinter  import Tk
from datetime import datetime
from time     import sleep
from json     import dumps

def main():
    specs = {
        'user': getuser(),
        'width': Tk().winfo_screenwidth(),
        'height': Tk().winfo_screenheight()
    }
    with open('log.json', 'w') as outfile:
        outfile.write(dumps(specs))
        while True:
            dt = datetime.now()
            t = {
                'date': dt.strftime('%m/%d/%Y'),
                'time': dt.strftime('%H:%M:%S')
            }
            outfile.write(dumps(t))
            sleep(1)

if __name__ == '__main__':
    main()
