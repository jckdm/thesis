from datetime import datetime
from AppKit   import NSWorkspace
from getpass  import getuser
from tkinter  import Tk
from json     import dump
from time     import sleep

def record():
    dt = datetime.now()
    a = NSWorkspace.sharedWorkspace().activeApplication()
    entry = {
      'date': dt.strftime('%m/%d/%Y'),
      'time': dt.strftime('%H:%M:%S'),
      'app': a['NSApplicationName'],
      'pid': a['NSApplicationProcessIdentifier']
    }
    return entry

def main():
    obj = {
        'user': getuser(),
        'width': Tk().winfo_screenwidth(),
        'height': Tk().winfo_screenheight(),
        'data': []
    }
    with open('log.json', 'w') as log:
        while True:
            obj['data'].append(record())
            log.seek(0)
            dump(obj, log, indent=2)
            sleep(1)

if __name__ == '__main__':
    main()
