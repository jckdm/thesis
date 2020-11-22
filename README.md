# Digital Distancing

In the post-[GDPR](https://www.wired.co.uk/article/what-is-gdpr-uk-eu-legislation-compliance-summary-fines-2018) world, it seems that every online interaction comes packaged with constant reminders of data tracking. For the first time in the digital age, our data can be experienced with the most rudimentary digital verbs: VIEW your data, DOWNLOAD your data, DELETE your data. Previously taken in secret, data now comes hand in hand with consent; but have we become any more in control of our digital footprint? Is it our awareness, our potential for intervention, or is it our passive consent which gives us this shaky semblance of control?

I propose a series of tools which seek to redefine our relationship with data through novel visual interpretation.


### The Tracker

records a user’s mouse and in-use application. In doing so, the Tracker tracks gesture, space, and time and creates two opposing visual representations of a user's computer usage. First, it produces images which illuminate paths and hotspots; these visualizations allow a user to query, sort, segment, and animate their data. Second, it produces lists which highlight texture; these visualizations are static to allow for readability.


### The Tracer

extracts Exif metadata from images, specifically their coordinates and timestamps. With it, the Tracer draws paths of a user's movement through physical space, producing images which illustrate alternative geometries. Rather than mapping this data to specific locations for the purpose of surveillance and tracking, the Tracer considers coordinates abstractly.


### That is all to say,

devoid of context, it is unclear if this data still serves a 'function'. Despite having always been in our peripheries, it has become somewhat unfamiliar, and when we ask the newly necessary question of purpose, we only further defamiliarize it. Defamiliarization is the Tracer's primary goal, and it does so by interpreting our physical experiences in digital contexts. By highlighting the data embedded in our visual artifacts, it serves as a method of reorganization.

This data, similar to mouse coordinates, exists like radio static in the background of our digital environments. The Tracker—by centering the minutia and creating mass amounts of it—seeks to reverse the conversation, serving as a platform for reflection, commentary, and retort. The estranged images we're left with are untraceable maps between windows, images, and points of interest.

Rather than tracking tasks and analyzing trends for the purpose of creating a sellable product, these tools only make us more aware of ourselves. They reduce all interactions to data, but in the end, it must be asked if through this process of data collection, if we've actually gained anything at all. And how can we claim that this data is personal when we've never before seen it, and certainly don't recognize it?

Why do we need a computer to perform these tasks for us, anyway? Could a human not pay attention to these pieces of data, themself? Maybe most crucially, have we ever thought to ask if any of this is fun or arousing? That is, do we like our data and what it allows us to see, feel, and believe?

Who defines digital behavior, and what differentiates it from our physical behavior? How are we learning to develop technological biases? And as we socially distance and learn to be hyper-aware of how we move through public, physical spaces, how are we (re-)learning to move through our private, digital spaces?


## Installation & Usage

1. Install [Homebrew](https://brew.sh/)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```
2. Clone Repository
```bash
git clone https://github.com/jckdm/tracker
git clone https://github.com/jckdm/tracer
```
3. Install requirements
```bash
pip3 install --user -r requirements.txt
```
4. Run Tracker
```bash
python3 main.py
```


## Credits

Special thanks to advisors Dr. Benedict Brown, Justin Berry, and Dr. Julie Dorsey, housemates Felicia Chang and Rianna Turner, and friends Shayna Sragovicz, Helen Kauder, Gia Grier, Harry Jain, & Michaela Shelton.
