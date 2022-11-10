let store = {
    user: { name: "Student" },
    apod: '',
    currentRover: '',
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    console.log(store);
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { currentRover, apod } = state

    return `
        <button class="tablink"  onclick="openPage('Home')" id="defaultOpen">Home</button>
        <button class="tablink" onclick="openPage('Curiosity')" id="Curiosity">Curiosity</button>
        <button class="tablink" onclick="openPage('Opportunity')" id="Opportunity">Opportunity</button>
        <button class="tablink" onclick="openPage('Spirit')" id="Spirit">Spirit</button>

        <div id="Content" class="tabcontent">
            ${createContent(apod)}
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
const getRoverData = (pageName, state) => {
    let { apod } = state

    if (pageName === 'Home') {
        apod = '';
        updateStore(store, { apod })
    } else { 
        fetch(`http://localhost:3000/rovers/${pageName}`)
            .then(res => res.json())
            .then(apod => updateStore(store, { apod }))
    }
}

// Creates HTML content based on the state of the apod
// -------------------------------------------------------------------
const createContent = (apod) => {

    if (!apod) {
        return getHomePage();
    }

    return getGallary(apod);
}

// Returns HTML content for the home page
// -------------------------------------------------------------------
const getHomePage = () => {
    return `
        <section>
            <h3>Put things on the page!</h3>
            <p>Here is an example section.</p>
            <p>
                second time
            </p>
        </section>
    `
}

// Traverse the apod and return the HTML for header content and the photo galary
// -------------------------------------------------------------------
const getGallary = (apod) => {
    
    let gallary = '';

    gallary += getHeaderInfo(apod);
    
    console.log(apod);
    apod.latest_photos.forEach( async (photo) => {
        gallary += getPhoto(photo)
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
const getPhoto = (photo) => {
    return `
        <div class="gallery">
            <a target="_blank" href="${photo.img_src}">
                <img src="${photo.img_src}">
            </a>
        </div>
    `
}