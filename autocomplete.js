// Init
let db; // Autocomplete database
//HACK(?) this url is probs NOT how github wants this to be fetched but uh, idc lmao
var dbUrl = 'https://raw.githubusercontent.com/Snappsu/FurAffinity-Autocomplete/tag-db-migration/res/db/tags.json'
var options = {
  method: 'GET'
}; // For fetching the database
var addedTags = [] // For keeping track of tags to be filled
var addedRegexp = [] // For keeping track of the search strings
//TO-DO Tighten up regexp to only capture exact matches
//rn wgm will test positve for wg
var tagRegExp = new RegExp(/(?:((?:\d|\w)+(?:_| ))+(?:\d|\w)+|(?:\d|\w)+)+/, "g") // Regular Expression for separating tags
var searchBox = document.getElementById("searchbox").children[0] // Search box element

// Autocomplete function
function Autocomplete(query) {
  //Empty added tags
  addedTags = []
  addedRegexp = []

  //Separate tags
  let preTags = [...query.match(tagRegExp)]
  console.log(preTags)

  //For each tag
  for (let i = 0; i < preTags.length; i++) {
    for (let j = 0; j < db.length; j++) {
      let dbTagRegExp = new RegExp(db[j].Regex, "g")
      console.log(preTags[i] + "=>" + dbTagRegExp)
      if (dbTagRegExp.test(preTags[i])) {
        console.log("Match found: " + db[j].GeneralTag)
        addedTags.push(db[j].GeneralTag)
        addedRegexp.push(db[j].Regex)
      }
    }
  }

  //Wrap Up
  console.log("All tags found: " + addedTags)
}

// When search box is changed
function SearchChanged(event) {
  let query = searchBox.value
  switch (event.key) {

    case "Enter":

      Autocomplete(query)
      let searchQuery = ""
      for (let i = 0; i < addedRegexp.length; i++) {
        searchQuery += (addedRegexp[i] + " ")
      }
      console.log(searchQuery)
      let baseUrl = "https://www.furaffinity.net/search/?q="
      window.open(baseUrl + searchQuery, '_blank').focus();
      break

    default:
      query = searchBox.value
      Autocomplete(query)
  }

}

// When search box is submitted
function SearchSubmit() {

}

// Listen for keypresses to search box
searchBox.addEventListener("keypress", SearchChanged)

// Listen to submit to search box (
searchBox.addEventListener("submit", SearchSubmit)


// Get the autocomp database
fetch(dbUrl, options)
  .then(response => response.json())
  .then(response => db = response)
  .then(response => console.log(response))
  .catch(err => console.error(err));
