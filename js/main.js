// Obtenemos el select
const select = document.getElementById("select-ubication");
select.addEventListener("change", handleChange);

// Muestra el label dependiendo de la informacion
const weatherType = {
  clear: "Clear",
  pcloudy: "Partially cloudy",
  mcloudy: "Mostly cloudy",
  cloudy: "Cloudy",
  rain: "Rain",
  humid: "Humid",
  ishower: "Isolated Shower",
  lightrain: "Light rain",
  oshower: "Occasional shower",
  snow: "Snow",
  lightsnow: "Light snow",
  ts: "Thunderstorm",
  rainsnow: "Rain and snow",
};

// Muestra la imagen dependiendo de la informacion
const watherImage = {
  clear: "clear.png",
  pcloudy: "mcloudy_pcloudy.png",
  mcloudy: "mcloudy_pcloudy.png",
  cloudy: "cloudy.png",
  rain: "rain.png",
  humid: "humid.png",
  ishower: "ishower.png",
  lightrain: "lightrain.png",
  oshower: "oshower.png",
  snow: "snow.png",
  lightsnow: "lightsnow.png",
  train: "train.png",
  tstorm: "tstorm.png",
  rainsnow: "rainsnow.png",
};

// Meses en ingles
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Obtenemos el archivo con las coordenadas
fetch("./coordinates.json")
  .then((response) => response.json())
  .then((datos) => {
    // Usa map para generar las opciones
    datos.map((dato) => {
      let opcion = document.createElement("option");
      opcion.value = `${dato.latitude}, ${dato.longitude}`;
      opcion.text = `${dato.city}, ${dato.country}`;
      // Insertamos las opciones en el select
      select.add(opcion);
    });
  })
  .catch((error) => console.error("Error:", error));

//Funcion para hacer la peticion a la API
async function fetchApi(lat, lon) {
  let api = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(api, requestOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// Detecta el cambio del select para hacer la peticion
async function handleChange(e) {
  // Ocultamos el contenedor de las tarjetas y mostramos el loader
  document.getElementById("weather-container").style.display = "none";
  document.getElementById("loader").style.display = "block"
  //Formateamos el valor para obtener la latitud y longitud
  const value = e.target.value.split(",");
  const latitud = value[0];
  const longitud = value[1];

  //Llamamos a la funcion para hacer la peticion
  const response = await fetchApi(latitud, longitud);

  // Mapeamos la respuesta e insertamos las tarjetas
  let tarjetas = response.dataseries
    .map((data) => {
      let imageSrc = `./images/${watherImage[data.weather]}`;
      return `<div class="weather-card-info-container" id="weather-card-info-container">
      <div class="weather-card-image-container">
        <img src=${imageSrc} width="100%"/>
      </div>
      <p class="weather-date">${formatDate(data.date)}</p>
      <div class="weather-average-temperature-container">
          <p class="weather-average-temperature-min">${data.temp2m.min}°</p>
          <p class="weather-average-temperature-max">${data.temp2m.max}°</p>
      </div>
      <p class="weather-state">${weatherType[data.weather]}</p>
  </div>`;
    })
    .join("");

  document.getElementById("weather-container").innerHTML = tarjetas;
  // Oculta el loader y muestra las tarjetas
  document.getElementById("loader").style.display = "none";
  document.getElementById("weather-container").style.display = "grid";
}

// Funcion para formatear la fecha
function formatDate(date) {
  date = date.toString();
  let year = date.substring(0, 4);
  let month = date.substring(4, 6);
  let day = date.substring(6, 8);

  let format = new Date(year, month - 1, day);
  let monthName = months[format.getMonth()];

  return `${day}, ${monthName}, ${year}`;
}
