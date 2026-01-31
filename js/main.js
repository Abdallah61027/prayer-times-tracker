let app = document.querySelector(".app");
let datesSpans = document.querySelectorAll(".app .timings p span");
let citySpan = document.querySelector(".info .col p .city");
let dateSpan = document.querySelector(".info .col p .date");
let timeSpan = document.querySelector(".info .col .time");
let nextAthanName = document.querySelector(".next-athan h3")
let nextAthanSpan = document.querySelector(".next-athan span")
// Settings Elements Selection
let settingsBtn = document.querySelector(".settings-icon");
let settingsDiv = document.querySelector(".settings");
let selectCountryItem = document.querySelector(".settings select#country");
let selectCityItem = document.querySelector(".settings select#city");
let h12SystemSwitch = document.querySelector(".settings .switch input")
let settingsClose = document.querySelector(".settings .close");
let saveSettings = document.querySelector(".settings #save");

let allCountries,country=localStorage.country||"Egypt",city=localStorage.city||"Cairo",times, tomorrowTimes, time, date, nextAthan, timezone;

let athansNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"]

// Intervals
let updateTimeInterval;
let updateTimeSpanInterval;
let nextAthanCountdounInterval;

getCountries()


settingsBtn.addEventListener("click", function () {
  openSettings()
  updateSettings()
})
selectCountryItem.addEventListener("change", function () {
  updateCitiesList(selectCountryItem.value)
})
saveSettings.addEventListener("click", function() {
  saveChanges()
  getTimes()
  closeSettings()
})

settingsClose.addEventListener("click", function() {
  closeSettings()
})


// API request Fumction
function getTimes() {
  const urlCountry = encodeURIComponent(`${allCountries[country].value}`);
  const urlCity = encodeURIComponent(`${allCountries[country].governorates[city]}`);
  const method = encodeURIComponent(`${allCountries[country].method}`);
  const timezoneRequestURL = `https://api.aladhan.com/v1/timingsByCity?city=${urlCity}&country=${urlCountry}&method=${method}`
  
  axios.get(timezoneRequestURL)
    .then(res => {
      timezone = res.data.data.meta.timezone      
      date = new Date().toLocaleDateString("en-GB", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      const timesRequestURL = `https://api.aladhan.com/v1/calendarByCity/${date.split("/")[2]}/${date.split("/")[1]}?city=${urlCity}&country=${urlCountry}&method=${method}`
      return axios.get(timesRequestURL)
    })
    .then(res => {
      const data = res.data.data[date.split("/")[0]-1].timings;
      const tomorrowData = res.data.data[date.split("/")[0]]?res.data.data[date.split("/")[0]].timings:res.data.data[date.split("/")[0]-1].timings;
      times = [
        data.Fajr.split(" ")[0],
        data.Sunrise.split(" ")[0],
        data.Dhuhr.split(" ")[0],
        data.Asr.split(" ")[0],
        data.Maghrib.split(" ")[0],
        data.Isha.split(" ")[0]
      ];
      tomorrowTimes = [
        tomorrowData.Fajr.split(" ")[0],
        tomorrowData.Sunrise.split(" ")[0],
        tomorrowData.Dhuhr.split(" ")[0],
        tomorrowData.Asr.split(" ")[0],
        tomorrowData.Maghrib.split(" ")[0],
        tomorrowData.Isha.split(" ")[0]
      ];
      time = new Date().toLocaleTimeString("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      clearInterval(updateTimeInterval)
      updateTimeInterval = setInterval(() => {
        time = new Date().toLocaleTimeString("en-GB", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
      }, 1000);
      nextAthanCountdoun()
      setData();
    })
    .catch(err => console.error("Error fetching timings:", err));
  }

  
// Present The API Response (Timings)
function setData () {
  citySpan.innerHTML = city;  
  dateSpan.innerHTML = date;
  const h12System = JSON.parse(localStorage.getItem("h12System") || "false");
  clearInterval(updateTimeSpanInterval)
  updateTimeSpanInterval = setInterval(() => {
    let currTime = [time.split(":")[0],time.split(":")[1]]
    if (h12System === false){
      timeSpan.innerHTML = currTime.join(":")
    } else {
      timeSpan.innerHTML = format12h(currTime.join(":")).join(":")
    }
  }, 1000);

  for(let i=0; i<times.length; i++) {
    if (h12System === true) {
      datesSpans[i].innerHTML = format12h(times[i]).join(":");
    } else {
        datesSpans[i].innerHTML = times[i]
    }
  }
}
// Get All Available Countries
function getCountries() {
  fetch("countries.json")
  .then((res) => {return res.json()})
  .then((res) => {
    allCountries = res;
    
    getTimes()
    
  })
}
// Start Settings Functions
function closeSettings () {
  settingsDiv.style.display = "none";
}

function openSettings () {
  settingsDiv.style.display = "block";
}

function updateSettings() {
  selectCountryItem.innerHTML ="";
  for(let countryName in allCountries) {
    let option = document.createElement("option")
    option.setAttribute("value",countryName)
    option.innerHTML = countryName;
    selectCountryItem.appendChild(option)
    if (option.value === country) {
      option.selected = true;
    }
  }
  updateCitiesList(selectCountryItem.value)
  if (localStorage.h12System) {
    h12SystemSwitch.checked = JSON.parse(localStorage.h12System);
  }
}

function updateCitiesList(selectedCountry) {
  let cities = Object.keys(allCountries[selectedCountry].governorates)
  selectCityItem.innerHTML ="";
  cities.forEach((city) => {
    let option = document.createElement("option")
    option.setAttribute("value",city)
    option.innerHTML = city;
    selectCityItem.appendChild(option)
  })
  let citiesOptions = document.querySelectorAll(".settings select#city option")
  citiesOptions.forEach((option) => {
    if (option.value == city) {
      option.selected = true;
    }
  })
}
function saveChanges() {
  localStorage.setItem("country",selectCountryItem.value)
  localStorage.setItem("city",selectCityItem.value)
  localStorage.setItem("h12System", JSON.stringify(h12SystemSwitch.checked))
  country = selectCountryItem.value
  city = selectCityItem.value
}

function nextAthanCountdoun () {
  clearInterval(nextAthanCountdounInterval)
  nextAthanCountdounInterval = setInterval(() => {
    let timesInMinutes = [];
    let tomorrowTimesInMinutes = [];
    let nextAthanInMinutes;
    let [currH, currM, currS] = time.split(":").map(Number);
    let reminigTimeInMinutes;
    for (let i=0; i<times.length; i++) {
      let h = +times[i].split(":")[0]
      let m = +times[i].split(":")[1]
      if (h < 12 && i >= 2) h += 12;
      timesInMinutes.push(h*60 + m);
    }
    for (let i=0; i<times.length; i++) {
      let h = +tomorrowTimes[i].split(":")[0]
      let m = +tomorrowTimes[i].split(":")[1]
      if (h < 12 && i >= 2) h += 12;
      tomorrowTimesInMinutes.push(h*60 + m);
    }
    let currTimeInMinutes = currH*60 + currM;

    if (currTimeInMinutes < timesInMinutes[0] || currTimeInMinutes >= timesInMinutes[timesInMinutes.length - 1]) {
      nextAthan = athansNames[0]
      nextAthanInMinutes = timesInMinutes[0];
      if (currTimeInMinutes < timesInMinutes[0]) {
        reminigTimeInMinutes = timesInMinutes[0] - currTimeInMinutes
      } else {
        reminigTimeInMinutes = (1440 - currTimeInMinutes) + tomorrowTimesInMinutes[0]
      }
    }
    else {
      for (let i = 0; i < timesInMinutes.length; i++) {
        if (
          currTimeInMinutes >= timesInMinutes[i] &&
          currTimeInMinutes < timesInMinutes[i + 1]
        ) {
          nextAthan = athansNames[i + 1];
          nextAthanInMinutes = timesInMinutes[i+1];
          reminigTimeInMinutes = nextAthanInMinutes - currTimeInMinutes;
          break;
        }
      }
    }
    nextAthanName.innerHTML = nextAthan;
    nextAthanSpan.innerHTML = remainingTime(reminigTimeInMinutes);
    let remainingSec = reminigTimeInMinutes*60 - (currH*3600 + currM*60 + currS);
    if (remainingSec <= 0) {
      getTimes();
    }
  }, 1000);
}
function remainingTime(remainigInMinutes) {
  let h,m,s
  h = Math.floor((remainigInMinutes) / 60);
  m = (remainigInMinutes) % 60;
  if (+time.split(":")[2] !== 0) {
    s = 60 - +time.split(":")[2];
  } else {
    s = 0;
  }
  remaining = `${h}:${m>9?m :"0"+m}:${s>9?s:"0"+s}`;
  return remaining;
}

function format12h(time24) {
    let [h, m] = time24.split(":").map(Number);
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return [h<10?"0"+h:h, m<10?"0"+m:m];
}