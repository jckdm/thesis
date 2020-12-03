# Digital Distancing

## Tracker

Tracker first records a user's username and screen dimensions in order to create uniquely named .csv and .db files in the format of `username-width-height-`. Every second, the `record()` function returns to `main()` an array with a snapshot of a user's data, including the date, time, in-use application and its process ID, and the coordinates of the user's mouse. This data is inserted into the .db file and written as a new row in the .csv.


## Tracer

Tracer first obtains a path from a user and reads all valid image files in the given directory. It extracts Exif data from each image, specifically its GPS information and date and time created. By separating out the degrees, minutes, and seconds of the latitude and longitude, Tracer calculates composite coordinate values. If the user chooses, Tracer can sort the images by the date and time they were created. Finally, Tracer uses plotly to create three visualizations: unsorted, sorted, or overlaid paths.


## Visualizations

The data collected by Tracker can be visualized in three ways. Each type of visualization is created through functions in two JavaScript files: one with the name of the visualization type, and the other with `-helper`. The first file parses the data files into various data structures. The `-helper` file contains functions which visualize and analyze the data.

All three visualizations rely on a dictionary of colors:
```javascript
const color = {}; // each app's name and its associated color, formatted as [appName] = color (in hex code)
```


## Grapher

Files
```
grapher.html
grapher.js
grapher-helper.js
```
Data structures
```javascript
const apps = []; // each datapoint as a coordinate pair and its respective app, formatted as [x, y, app]
const cleanedApps = {}; // each app's name without non-alphanumeric characters, formatted as [appName] = cleanedAppName
```
Functions
```javascript
rad(r) // args = r: new radius selected by user
// changes radius of all circle datapoints in graph

filters(id) // args = id: id of button clicked
// changes flags which toggle visibility/functionality of Time, Lines, and Axes. calls swap() to style buttons

swap(id, cId, b, flag) // args = id: id of button clicked, cId: id without non-alphanumeric characters, b: button's HTML element, flag: boolean to determine if button being turned on/off
// switches buttons on/off through css styling

circleSwap(cId, on) // args = cId: id without non-alphanumeric characters, on: boolean to determine if circle datapoints being shown/hidden
// switches circle datapoints on/off through css styling

query(id) // args = id: id of button clicked
// recursive function which calls swap() and circleSwap() to style buttons and circle datapoints. toggles visibility of circle datapoints, animates data and draws lines between points to show path of user's mouse over time.
```


## Mapper

Files
```
mapper.html
mapper.js
mapper-helper.js
```
Data structures
```javascript
const apps = []; // each datapoint as a coordinate pair and its respective app, formatted as [x, y, app]
const cleanedApps = {}; // each app's name without non-alphanumeric characters, formatted as [appName] = cleanedAppName
```
Functions
```javascript
scaleColor(c) // args = c: total number of seconds spent in a given quadrant
// logarithmically scales number of seconds into a shade of gray as a proportion of the largest number of seconds spent in any quadrant. returns 'zero' if no seconds spent in a quadrant

grid(x) // args = x: quadrant size chosen by user, defaults to 10. if x == 'z', hide all zero-value quadrants. if x == 'c', color each quadrant by the most used application, instead of gray.
// creates the entire data visualization. removes previous visualizations and draws a new grid. creates arrays of dictionaries for each row. assigns each datapoint to a given bucket and keeps track of a maximum. on hover, each quadrant reveals a tooltip which displays a pie chart of the apps used within that quadrant. handles Hide 0 and Color by most used app functionality.
```


## Reader

Files
```
reader.html
reader.js
reader-helper.js
```
Data structures
```javascript
const apps = []; // name of in-use app at every second
const times = []; // time of data collection, formatted as HH:MM:SS
const patterns = {}; // names of two apps which form a pattern and total number of instances of this pattern, formatted as [app1-app2] = number of instances
```
Functions
```javascript
clean(t) // args = t: selected element of which to reset styles
// resets rectangle styles, removes lines, calls showText() to reset visualization

resize(h) // args = h: rectangle height chosen by user, defaults to 15
// loops over all existing rectangles and changes height and y position of each to create new visualization

showText(x) // args = x: boolean to determine if all text being shown
// removes previous text and lines from visualization. depending on value of boolean alltext, appends every app or only when user has just switched to another app

analyze()
// runs data analysis on visualization and reports summary in modal. calculates number of apps used, time span of data collection, percent of active time in that interval, number of switches between apps and average amount of time spent in each app. identifies longest period of continuous switching between two applications, number of switches, and span of switches. analysis algorithm first sorts number of isolated pattern occurrences in descending order and only considers a pattern if it has more isolated occurrences than the longest seen pattern.

showColor(x) // args = x: boolean to determine if all colored rectangles being shown
// removes previous colored rectangles and lines from visualization. depending on value of boolean allcolor, appends every colored rectangle or only when user has just switched to another app. uses svgs to create rectangles, with attributes stored in dictionary attrs. on mouseover of colored rectangle, draws lines to all instances of the associated app in the text column.
```
