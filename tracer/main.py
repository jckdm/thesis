from sys                  import exit
from os                   import path
from glob                 import glob
from PIL                  import Image
from PIL.ExifTags         import TAGS
from plotly.graph_objects import Layout, Figure

def main():
    # get path to directory
    filepath = input('Path to directory (blank if PWD): ')

    # check if valid path
    if filepath != '':
        if not path.isdir(filepath):
            exit('Invalid path')

    data, lats, lons, flag, good, bad = [], [None, None], [None, None], False, 0, 0

    # read all files in dir
    for file in glob(filepath + '*'):
        file = file.lower()
        # skip non-image files
        if not file.endswith('.jpg') and not file.endswith('.jpeg') and not file.endswith('.png') and not file.endswith('.heic'):
            continue

        # extract EXIF data from image
        exif = {
            TAGS[key]: val
            for key, val in Image.open(file).getexif().items()
            if key in TAGS
        }

        # extract GPS + datetime
        try:
            loc = exif['GPSInfo']
            dt = exif['DateTimeOriginal']
            good += 1
        # skip if either missing
        except KeyError:
            bad += 1
            continue

        # extract latitude and longitude
        lat = { 'dir': loc[1], 'deg': loc[2][0], 'min': loc[2][1], 'sec': loc[2][2] }
        lon = { 'dir': loc[3], 'deg': loc[4][0], 'min': loc[4][1], 'sec': loc[4][2] }

        # calculate full coordinate with degree, minute, second
        truLat = float(lat['deg'] + (lat['min'] / 60.0) + (lat['sec'] / 3600.0))
        truLon = float(lon['deg'] + (lon['min'] / 60.0) + (lon['sec'] / 3600.0))

        # calculate mins and maxes
        if flag:
            lons[0], lons[1] = min(lons[0], truLon), max(lons[1], truLon)
            lats[0], lats[1] = min(lats[0], truLat), max(lats[1], truLat)
        # first time just assign values and flip flag
        else:
            lons[0], lons[1] = truLon, truLon
            lats[0], lats[1] = truLat, truLat
            flag = True

        data.append({
            'img': file, 'lat': lat, 'lon': lon, 'datetime': dt, 'truLat': truLat, 'truLon': truLon
        })

    # not enough valid images
    if good <= 1:
        exit('Didn\'t find enough valid image files for a visualization.')

    print(f'Extracted data from {good} files. Unable to extract from {bad}.')

    # ask user if they want their images sorted
    q = input('Would you like your images sorted by date and time? (yes/no): ')
    if q.lower() in ('yes', 'y'):
        data.sort(key = lambda x:x['datetime'])

    coords = 'M '
    # build string of coordinates
    for img in data:
        coords += (str(img['truLat']) + ',' + str(img['truLon']) + ' ') if (coords == 'M ') else ('L' + str(img['truLat']) + ',' + str(img['truLon']) + ' ')

    coords += 'Z'

    fig = Figure(layout = Layout(plot_bgcolor = 'RGBA(1,1,1,0)'))
    # draw axes from min to max
    fig.update_xaxes(range = [lats[0], lats[1]], color = 'white')
    fig.update_yaxes(range = [lons[0], lons[1]], color = 'white')

    # draw shape
    fig.update_layout(
        shapes = [{ 'type': 'path', 'path': coords, 'line_color': 'MediumSeaGreen' }]
    )

    fig.show()

if __name__ == '__main__':
    main()
