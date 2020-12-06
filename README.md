# Digital Distancing

## Proposal

In the post-[GDPR](https://www.wired.co.uk/article/what-is-gdpr-uk-eu-legislation-compliance-summary-fines-2018) world, it seems that every online interaction comes packaged with constant reminders of data tracking. For the first time in the digital age, our data can be experienced with the most rudimentary digital verbs: VIEW your data, DOWNLOAD your data, DELETE your data. Previously taken in secret, data now comes hand in hand with consent; `but have we become any more in control of our digital footprint? Is it our awareness, our potential for intervention, or is it our passive consent which gives us this shaky semblance of control?`

"Digital Distancing" considers the relationship between distance and technology in the era of social distancing in order to define a framework for understanding ourselves through our data. The project is comprised of a journal, a pair of data collection and extraction tools, and visualizations of this data.

Tracker, the first of these tools, records a user’s mouse and in-use application. In doing so, it tracks gesture, space, and time and creates three interactive visualizations of a user's computer usage. First, it produces graphs which illuminate paths and hotspots, allowing a user to query, segment, and animate their data. Second, it produces maps which distribute data across quadrants and can be scaled to re-layer the encoded information. Third, it produces a readable pair of lists which highlight the texture and patterns created by inflection points where a user switches between applications.

Tracer extracts Exif metadata from images, specifically their coordinates and timestamps and creates three opposing visual representations of a user's movement through physical space. In doing so, the Tracer draws paths which illustrate alternative geometries. Rather than mapping data to physical locations for the purpose of surveillance or tracking, the Tracer considers coordinates abstractly. First, it produces unsorted paths which are rendered- in random order—these paths are unpredictable in shape and difficult to trace. Second, it produces sorted paths rendered in chronological order according to the images' timestamps, resulting in traceable, logical paths. Third, it produces overlaid paths which combine both sorted and unsorted paths of the same image sets.

That is all to say, devoid of context, it is unclear if this data serves a "function". But when we ask questions of "function" and "purpose", it becomes obvious how unfamiliar our data is, despite having always been in our peripheries. Defamiliarization is the Tracer's primary goal, and it does so by interpreting our physical experiences in digital contexts. By highlighting the data embedded in our visual artifacts, it serves as a method of reorganization.

This data, similar to mouse coordinates, exists like radio static in the background of our digital environments. The Tracker—by centering the minutia and creating mass amounts of it—seeks to reverse the conversation, serving as a platform for reflection, commentary, and retort. The estranged images we're left with are untraceable maps between windows, images, and points of interest.

Rather than tracking tasks and analyzing trends for the purpose of creating a sellable product, these tools only make us more aware of ourselves. They reduce all interactions to data, but in the end, it must be asked if through this process of data collection, if we've actually gained anything at all. `And how can we claim that this data is personal when we've never before seen it, and certainly don't recognize it?`

`Why do we need a computer to perform these tasks for us, anyway? Could humans not pay attention to these pieces of data, ourselves?` Maybe most crucially, `have we ever thought to ask if any of this is fun or arousing?` That is, `do we like our data and what it allows us to see, feel, and believe?`

`Who defines digital behavior, and what differentiates it from our physical behavior? How are we learning to develop technological biases?` And as we socially distance and learn to be hyper-aware of how we move through public, physical spaces, `how are we (re-)learning to move through our private, digital spaces?`


## Installation & Usage

1. Install [Homebrew](https://brew.sh/)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```
2. Clone repository
```bash
git clone https://github.com/jckdm/tracker

git clone https://github.com/jckdm/tracer
```
3. Install requirements
```bash
pip3 install --user -r requirements.txt
```
4. Run program
```bash
python3 main.py
```
5. Visualize your Tracker files [on my site](https://jackadam.cc/thesis/visualizations.html). Uploaded files are stored locally; your data will not be transferred or saved.


## Credits

Thanks to advisors Dr. Benedict Brown, Justin Berry, and Dr. Julie Dorsey, housemates Felicia Chang and Rianna Turner, friends Shayna Sragovicz, Helen Kauder, Gia Grier, Harry Jain, Trey Lewis, Michaela Shelton, to my parents, and to the Yale Office of Emergency Management.
