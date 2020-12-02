# Digital Distancing

Each type of visualization is created through functions in two files: one with the name of the visualization type, and the other with -helper. The first file parses the data files into various data structures. The -helper file contains functions which visualize and analyze the data.

All three visualizations rely on a dictionary of colors:
```
const color = {};
- each app\'s name and its associated color, formatted as [appName] = color (in hex code)
```

## Grapher

Files
```
grapher.html
grapher.js
grapher-helper.js
```
Data structures
```
const apps = [];
- each entry is a coordinate pair and its respective app, formatted as [x, y, app]
const cleanedApps = {};
- each app\'s name without non-alphanumeric characters, formatted as [appName] = cleanedAppName
```
Functions
```
rad(r)
- args = r: new radius selected by user
- changes radius of all circle datapoints in graph

filters(id)
- args = id: id of button clicked
- changes flags which toggle visibility/functionality of Time, Lines, and Axes. calls swap() to style buttons

swap(id, cId, b, flag)
- args = id: id of button clicked, cId: id without non-alphanumeric characters, b: HTML element of button, flag: boolean to determine if button being turned on or off
- switches buttons on/off through css styling

circleSwap(cId, on)
- args = cId: id without non-alphanumeric characters, on: boolean to determine if circle datapoints being shown or hidden
- switches circle datapoints on/off through css styling

query(id)
- args = id: id of button clicked
- recursive function which calls swap() and circleSwap() to style buttons and circle datapoints. toggles visibility of circle datapoints, animates data and draws lines between points to show path of user\'s mouse over time.
```

## Mapper

Files
```
mapper.html
mapper.js
mapper-helper.js
```
Data structures
```
const apps = [];
- each entry is a coordinate pair and its respective app, formatted as [x, y, app]
const cleanedApps = {};
- each app\'s name without non-alphanumeric characters, formatted as [appName] = cleanedAppName
```
Functions
```
scaleColor(c)
- args = c: total number of seconds spent in a given quadrant
- logarithmically scales number of seconds into a shade of gray as a proportion of the largest number of seconds spent in a quadrant. returns 'zero' if no seconds spent in a quadrant

grid(x)
- args = x: quadrant size chosen by user, defaults to 10. if x == 'z', hide all zero-value quadrants. if x == 'c', color each quadrant by the most used application, instead of gray.
- creates the entire data visualization. removes previous visualizations and draws a new grid. creates arrays of dictionaries for each row. assigns each datapoint to a given bucket and keeps track of a maximum. on hover, each quadrant reveals a tooltip which displays a pie chart of the apps used within that quadrant. handles Hide 0 and Color by most used app functionality.
```

## Reader

Files
```
reader.html
reader.js
reader-helper.js
```
Data structures
```
const apps = [];
- name of the app being used at every second
const times = [];
- time (to the second) at which the user\'s data was collected, formatted as HH:MM:SS
const patterns = {};
- names of the two apps which form a pattern and the total number of instances of this pattern, formatted as [app1-app2] = number of instances
```
Functions
```
clean(t)
- args = t: selected element of which to reset styles
- resets rectangle styles, removes lines, calls showtext() to reset visualization

resize(h)
- args = h: rectangle height chosen by user, defaults to 15.
- loops over all existing rectangles and changes height and y position of each to create new visualization.

showtext(x)
- args = x: boolean to determine if all text being shown
- removes previous text and lines from visualization. depending on value of boolean alltext, appends every app or only when user has just switched to another app.

analyze()
- runs data analysis on visualization and reports summary in popup modal window. calculates number of apps used, time span of data, amount of active time in that interval, number of switches between apps and average amount of time spent in each app. identifies longest period of continuous switching between two applications, number of switches, and span of switches.

showcolor(x)
- args = x: boolean to determine if all colored rectangles being shown
- removes previous colored rectangles and lines from visualization. depending on value of boolean allcolor, appends every colored rectangle or only when user has just switched to another app. uses svgs to create rectangles, with attributes stored in dictionary attrs. on mouseover of colored rectangle, draws lines to all instances of the associated app in the text column.
```
