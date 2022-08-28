const wrapper = document.querySelector(".wrapper");
Dinputs = wrapper.querySelector(".input-part"),
infoTxt = Dinputs.querySelector(".info-txt"),
inputField = Dinputs.querySelector("input"),
loactionButton = Dinputs.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

var KeyName = `972f4a9632b1de8f2d0f4037996c1e53`;

const regionNames = new Intl.DisplayNames(
    ['en'], {type: 'region'}
  );

    inputField.addEventListener("keyup", e =>
    {
        //if user pressed the enter button and the input value is not empty
        if(e.key == "Enter" && inputField.value != "")
        {
            requestApi(inputField.value);
        }
    });

loactionButton.addEventListener("click", ()=>{
    if(navigator.geolocation)
    {
        //if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else{
        alert("Your browser does not support geolocation api :C");
    }
});

    arrowBack.addEventListener("click", ()=>
    {
        wrapper.classList.remove("active");
    });

    function onSuccess(posi)
    {
        const {latitude, longitude} = posi.coords;// getting the lat and lon of the user device from coords obtained
        let req = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${KeyName}`;

        fecthing(req);
    }
    function onError(err)
    {
        console.error(err);
        infoTxt.innnerText = err.message;
        infoTxt.classList.add("error");
    }

function requestApi(city)
{
    let req = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${KeyName}`;

   fecthing(req);
}

function fecthing(req)
{
    infoTxt.innnerText = "Getting Weather Information";
    infoTxt.classList.add("pending");

    //getting api esponse and returning it with parsing into js obj and in another
    //then function calling wetaher details function with passing api result as an argument
    fetch(req).then(repsonse => repsonse.json()).then(result => weatherDeatils(result));
}

function weatherDeatils(info)
{
   
    infoTxt.classList.replace("pending","error");
    if(info.cod == "404")
    {
        //location not found, doesnt exist
        infoTxt.innerText = `${inputField.value} is not a valid city name, Check Again Bob!`;
        
    }
    else{
        //get the wanted values from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
       
        const {feels_like, humidity,temp} = info.main;

        const countryName = regionNames.of(country);
        //using a custom icon according to he id of which api return to us
        if(id == 800)
        {
            //clear
            wIcon.src = "Icons/sunny_icon.png";
        }
        else  if(id >= 200 && id <= 232)
        {
            //stormj
            wIcon.src = "Icons/thunder_cloud_icon.png";
        }
        else  if(id >= 600 && id <= 622)
        {
            //snow
            wIcon.src = "Icons/snow_icon.png";
        }
        else  if(id >= 701 && id <= 781)
        {
            //haze
            wIcon.src = "Icons/haze_icon.png";
        }
        else  if(id >= 801 && id <= 804)
        {
            //cloud
            wIcon.src = "Icons/cloud_icon.png";
        }
        else  if((id >= 300 && id <= 321) || (id >= 500 && id <=531))
        {
            //rain
            wIcon.src = "Icons/rain_icon.png";
        }
        

        //pass this values to the html
       
        wrapper.querySelector(".temp .numb").innerText= Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${countryName}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
       
        console.log(wrapper.querySelector(".temp .numb").innerText);
        console.log(info);
    }

    
}