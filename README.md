# TRUCKLOADS of FOOD

A web-based application to allow users find the nearest food trucks using latitude & longitude coordinates.

## Setup

Setup is quite simple:

### Locally
1. Open up **index.html** via your favorite browser.

### On the web
1. Load all files & folders onto a web server.
2. Open up your favorite browser and point URL to web folder where project's **index.html** file is located.

## Documentation

### Language Choice
In my current role as manager for a big data team, I am mostly using Python & various SQL dialects. Previosly, my primary focus was JavaScript and it's various dialects. I thought it would be a good opportunity to try my hand again with JS.

### Folder Structure
For future maintainability, it's vital to clearly organize source files. In this case, both **index.html** and **README.md** are at the top-most level, with all *js* files within their own folder.

Inside the **js** folder, our own original files should be top-most while all third-party files are seperated into the **lib** folder. 

### Third-Party Libraries
- No reason to reinvent the wheel, specifically when the focus of the project is on showing food-truck data and not improving DOM tree traversing speed.
- It is best to keep a local copy of third-party files instead of fetching them from their CDN.
  - Pros
    - File to use when third-party CDN become unavailable
    - File update might accidently break our code
  - Cons
    - The onus of keeping library files up to date falls onto project owners

### Coding Reasoning
- Place project's code into it's own global variable.
  - Pros
    - Do not contaminate the global space
    - Reduce chance of interference with other JS code
  - Cons
    - A little more combursome for debugging in the console
- Request food truck data instead of using a local copy
  - Pros
    - Always getting the latest data
  - Cons
    - If food truck DB goes down, we can't show any food trucks
  - ToDo
    - Add a *fail gracefully* step, so if on the initial pull the data is not available, we let the user know
    - After first sucessful data pull, app should store the data and use that instead of doing a pull for every request to lower data usage and speed up search.
    - If the plan is for the app to go to a wider audience, we will want to think about storing the data pulls  onto a server on a regular cycle to decrease the calls to the external API and limit the chance of getting blocked.
    - Decide how long the data should be stored locally before doing another fresh pull
- Use (open-source, community driven) thrid-party code snippets when appropriate
  - A few code snippets where pulled from StackOverflow (distance from lat/lon coordinates, sorting array) and was clearly labeled
  - Pros
    - The community has voted on what is the best solution
    - Save us time on what would be considered **helper functions**
    - Aligns with the idea of using open-source libraries
  - Cons
    - Not our own original code
    - Need to check license
- Private functions with underscore (ie _loadFoodTruckData())
  - Pros
    - Let's developers easily see function that are not access direclty by the end-user
  - Cons
    - If in a later update the function turns from private to public, there will need to be some clean-up
- Seperating the ordered list from the food truck data list
  - Pros
    - Keeps the food truck data list clean.
    - Puts all manipulations on the ordered list, which we can delete later with confidence when no longer needed.
    - During sorting, we don't care about the food truck details, we only care about it's distance from our search point.
- Sort as we go
  - Pros
    - Faster to sort through a sorted list than an unsorted list.
- LN 34: Using *.map** instead of **each**
  - Faster to access the entry using **map**, instead of having to reference it using index for **each**
- Seperate function to get data ready for output (LN 94)
  - Pros
    - When we decide to change the output style (ie, from Tabulator to a map), it will require a new data structure. This way we modularize our code and only have to write a new function to get the data into the new structure instead of changing the innards of the code.

### Future Updates
- Add CSS to spruce up the application
- Use an open-source map visualizer display closest food trucks
- Allow user various ways to input their location
  - Use current location
  - Physical address
- Seperate helper functions to their own file (ie, helpers.js)
- Add function where all jQuery objects are created
  - Reason: If a DOM object gets modified in the HTML in a future code update, it will be easier for the developer to only look at one location of the code instead of looking all over.
- Add documentation to the JS functions
- Add form validation
