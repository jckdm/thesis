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

    meta = input('\nShow metadata? (y/n): ')

    if meta.lower() in ('yes', 'y'):
        metaflag = True
    elif meta.lower() in ('no', 'n'):
        metaflag = False
    else:
        exit('Invalid response')

    # read all files in dir
    for file in glob(filepath + '*'):
        file = file.lower()
        # skip non-image files
        if not file.endswith('.jpg') and not file.endswith('.jpeg') and not file.endswith('.png'):
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

        if metaflag:
            cleanLat = str(lat['deg']) + '° ' + str(lat['min']) + '\' ' + str(lat['sec']) + '\" ' + str(lat['dir'])
            cleanLon = str(lon['deg']) + '° ' + str(lon['min']) + '\' ' + str(lon['sec']) + '\" ' + str(lon['dir'])

            print(f'File: {file}   Latitude: {cleanLat}   Longitude: {cleanLon}   Time: {dt}')

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

    print(f'\nExtracted metadata from {good} files. Unable to extract from {bad}.\n')

    # prompt for viz choice
    q = input('Please enter the number corresponding to your visualization of choice:\n1: Unsorted path\n2: Sorted path\n3: Both paths overlaid\n\n#: ')

    # validate user input
    while q not in ('1', '2', '3'):
        q = input('#: ')
    q = int(q)

    coords, sortedCoords, unSortedData = 'M ', 'M ', None

    # copy data, add first point
    if q == 1 or q == 3:
        unSortedData = data.copy()
        coords += str(unSortedData[0]['truLat']) + ',' + str(unSortedData[0]['truLon']) + ' '
    # sort data, add first point
    if q == 2 or q == 3:
        data.sort(key = lambda x:x['datetime'])
        sortedCoords += str(data[0]['truLat']) + ',' + str(data[0]['truLon']) + ' '

    # append rest of points
    for i in range(1, good):
        if q == 1 or q == 3:
             coords += ('L' + str(unSortedData[i]['truLat']) + ',' + str(unSortedData[i]['truLon']) + ' ')
        if q == 2 or q == 3:
             sortedCoords += ('L' + str(data[i]['truLat']) + ',' + str(data[i]['truLon']) + ' ')

    paths = []

    # if using unsorted, append path
    if coords != 'M ':
        paths.append({ 'type': 'path', 'path': coords, 'line_color': '#3CB371' })
    # if using sorted, append path
    if sortedCoords != 'M ':
        paths.append({ 'type': 'path', 'path': sortedCoords, 'line_color': '#6666FF' })

    fig = Figure(layout = Layout(plot_bgcolor = 'RGBA(1,1,1,0)'))
    # draw axes from min to max
    fig.update_xaxes(range = [lats[0], lats[1]], color = '#FFFFFF')
    fig.update_yaxes(range = [lons[0], lons[1]], color = '#FFFFFF')

    fig.update_layout(shapes = paths)
    fig.show()

if __name__ == '__main__':
    main()
