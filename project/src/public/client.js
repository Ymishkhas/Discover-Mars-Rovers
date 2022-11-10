let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: '',
});

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = store.merge(newState);
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {

    return `
        <button class="tablink"  onclick="openPage('Home')" id="defaultOpen">Home</button>
        <button class="tablink" onclick="openPage('Curiosity')" id="Curiosity">Curiosity</button>
        <button class="tablink" onclick="openPage('Opportunity')" id="Opportunity">Opportunity</button>
        <button class="tablink" onclick="openPage('Spirit')" id="Spirit">Spirit</button>

        <div id="Content" class="tabcontent">
            ${createContent(state)}
        </div>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})


// ------------------------------------------------------------------------------------------------------------
//                                                COMPONENTS
// ------------------------------------------------------------------------------------------------------------

// Called based on the tab pressed, updates the store based on the requested page
// -------------------------------------------------------------------
function openPage(pageName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }

    getRoverData(pageName, store)
}

// API call to get a rover data by it's name (the requested page name)
// -------------------------------------------------------------------
const getRoverData = async (pageName, state) => {
    let { apod } = state

    if (pageName === 'Home') {
        apod = '';
        updateStore(store, { apod })
    } else { 
        const response = await fetch(`http://localhost:3000/rovers/${pageName}`)
        
        apod = await response.json()
        const newState = store.set('apod', apod);
        
        updateStore(store, newState)
    }
}

// Creates HTML content based on the state of the apod
// -------------------------------------------------------------------
const createContent = (state) => {
    const apod = state.get('apod');
    
    if (!apod) {
        return getHomePage();
    }

    return getGallary(apod);
}

// Returns HTML content for the home page
// -------------------------------------------------------------------
const getHomePage = () => {
    return `
        <h1>Mars Exploration Rovers</h1>

        <section>
            <p>
            Mars is a fascinating planet. It is icy cold and covered in reddish dust and dirt. Like Earth, it has volcanoes, gullies, and flat plains.
            Scientists can also see channels that look like they were carved by rivers and streams a long, long time ago.
            </p>

            <p>
            It all began in 2003 with the launch of two rovers to explore the Martian surface and geology.
            both landed on Mars at separate locations in January 2004. Both rovers far outlived their planned missions of 90 Martian solar days.
            We are talking about MER-A Spirit and MER-B Opportunity</p>

            <p>
            Rovers have wheels and specialize in moving around. They land on the surface of Mars and drive around to different spots.
            </p>

            <p>
            They help scientists in their quest to understand what different parts of the planet are made of. 
            Mars is made up of lots of different types of rocks, and each rock is made up of a mixture of chemicals. 
            A rover can drive around to different areas, studying the different chemicals in each rock. 
            These chemicals can tell scientists something about the environments that changed that rock over time.
            </p>

            <br>
            <h2>Lets discover some of the rovers!</h2>
            <p>
            Toggele the menu up to select a rover and discover the latest images each one took.
            </p>
        </section>
    `
}

// HAS THE USE OF ARRAY MAP FUNCTION
// Traverse the apod and return the HTML for header content and the photo galary
// -------------------------------------------------------------------
const getGallary = (apod) => {
    
    let gallary = '';

    gallary += getHeaderInfo(apod);
    
    const imageSrcs = apod.latest_photos.map((photo) => photo.img_src);
    imageSrcs.forEach( async (img_src) => {
        gallary += getPhoto(img_src)
    });

    return gallary;
}

// Returns HTML content for the rover header content
// -------------------------------------------------------------------
const getHeaderInfo = (apod) => {
    return `
        <div class="desc">
            <div class="title">
                <h2>${apod.latest_photos[0].rover.name} Rover</h2>
                <div class="underline"></div>
            </div>
            <p>Launch date: ${apod.latest_photos[0].rover.launch_date}</p>
            <p>Landing date: ${apod.latest_photos[0].rover.landing_date}</p>
            <p>Rover status: ${apod.latest_photos[0].rover.status}</p>
        </div>
    `
}
// Returns HTML content for a single photo
// -------------------------------------------------------------------
const getPhoto = (img_src) => {
    return `
        <div class="gallery">
            <a target="_blank" href="${img_src}">
                <img src="${img_src}">
            </a>
        </div>
    `
}