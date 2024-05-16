import axios from 'axios';
import React,{createContext, useState, useContext, useEffect} from 'react'

function Time(){
    const [time,setTime] = useState('');
    const [date,setDate] = useState('');
    const [weekday,setWeekday] = useState('');
    
    setInterval(()=>{
        let today = new Date();
        setTime(today.toLocaleTimeString());
        setDate(today.toLocaleDateString());
        setWeekday(today.toLocaleDateString('en-US',{weekday:'long'}));
    },1000);

    return  (
        <div className='date_time'>
            <div className='time'>{time}</div>
            <div className='week'>{weekday}, <span className='date'>{date}</span></div>
        </div>
    )
}

function Base() {
    const images = {
        "Haze":"images/haze.jpg",
        "Clouds":"images/atmosphere.jpg",
        "Clear":"images/clear.jpg",
        "Thunderstorm":"images/thunderstorm.jpg",
        "Drizzle":"images/drizzle.jpg",
        "Rain":"images/rain 2.jpg",
        "Snow":"images/snow.jpg",
        "Atmosphere":"images/atmosphere.jpg",
        "Smoke":"images/smoke.png"
    }
    const [image,setImage] = useState('');
    const data = useContext(weatherContext);
    
    useEffect(()=>{

        if(data.weather)
            {
                setImage(images[data.weather[0].main]);
                console.log("updated weather")
            }
            else {
                setImage(images.Haze);
            }
    },[data])
    console.log(data);
    return (
        <div className='base' style={{backgroundImage:`url(${image})`}}>
            <div className="header">
                <h1 className='place'>{data.name}</h1>
                <h1 className='country_code'>{data && data.sys && data.sys.country}</h1>
            </div>
            <div className='footer'>
                <Time />
                <div className='temp'>{Math.round(data && data.main && data.main.temp)}<span className="unit">°C</span></div>
            </div>
        </div>
    )
}

function Searchbar(){
    const setQuery = useContext(queryContext);
    const [text,settext] = useState('');
    function handleChange(e){
        settext(e.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        setQuery(text);
    }
    return(
        <form onSubmit={handleSubmit}>
            <input className='search_input' onChange={handleChange} type="text" placeholder="Search city ..." />
            <button type="submit" className='submit'><img src="images/search.svg" alt="Search" /></button>
        </form>
    )
}

function Badge(props){
    return(
        <>
            <div className='badge'><span className='name'>{props.name}</span> <span className='value'>{props.value}</span></div>
        </>
    )
}

function Details(){
    var data = useContext(weatherContext);
    var temp = `${data.main && Math.round(data.main.temp)}°C(${data.weather && data.weather[0].main})`;
    var humidity = `${data.main && data.main.humidity}%`;
    var wind_speed = `${data.wind && data.wind.speed} Km/h`;
    var visibility = `${data.visibility && data.visibility} mi`;
    return(
        <div className='details'>
            <div className='icon'>
                <img src={`https://openweathermap.org/img/wn/${data.weather && data.weather[0].icon}@2x.png`} alt={data.weather && data.weather[0].main} />
            </div>
            <div className='title'>{data.weather && data.weather[0].main}</div>
            <Searchbar />
            <div className='city'>{data.name}, {data.sys && data.sys.country}</div>
            <div className="badges">
                <Badge name="Temperature" value = {temp} />
                <Badge name="Humidity" value={humidity} />
                <Badge name="Visibility" value={visibility} />
                <Badge name="Wind Speed" value={wind_speed} />
            </div>
        </div>
    )
}

const queryContext = createContext();
const weatherContext = createContext();

const Weather = () => {
    const [query,setQuery] = useState('Delhi');
    const [weather_data,setWeather_data] = useState({});

    
    const API_KEY = "39420fb8dd3d91967c347e0ff809cfc9"


    const API_key = API_KEY;
    var lat = 28.6333;
    var lon = 77.2167;
    async function makeApiCall(query){
        // get the location 
        var loc_url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${API_key}`
        var {data} = await axios.get(loc_url)
        if (data && data[0])
            data = data[0];
        else 
            return;
        lat = data.lat;
        lon = data.lon;
        var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
        
        // get the weather data
        var data = await axios.get(url) 
        if(data && data.data)
            setWeather_data(data.data);
        else 
            setWeather_data({});
    }
    useEffect(()=>{
        if(query)
            makeApiCall(query);
    },[query])
  return (
    <weatherContext.Provider value={weather_data}>
        <queryContext.Provider value={setQuery}>
            <div className='weather_app'>
                <Base />
                <Details />
            </div>
        </queryContext.Provider>
    </weatherContext.Provider>
  )
}

export default Weather;