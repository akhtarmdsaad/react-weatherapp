import axios from 'axios';
import React,{createContext, useState, useContext, useEffect} from 'react'

function Base() {
    const images = {
        "haze":"images/haze.jpg"
    }
    const [image,setImage] = useState('');
    const [time,setTime] = useState('');
    const [date,setDate] = useState('');
    const [weekday,setWeekday] = useState('');

    setInterval(()=>{
        let today = new Date();
        setTime(today.toLocaleTimeString());
        setDate(today.toLocaleDateString());
        setWeekday(today.toLocaleDateString('en-US',{weekday:'long'}));
    },1000);

    const data = useContext(weatherContext);
    if(image === ''){
        setImage(images.haze);
    }
    return (
        <div className='base' style={{backgroundImage:`url(${image})`}}>
            <div className="header">
                <h1 className='place'>{data.name}</h1>
                <h1 className='country_code'>{data && data.sys && data.sys.country}</h1>
            </div>
            <div className='footer'>
                <div className='date_time'>
                    <div className='time'>{time}</div>
                    <div className='week'>{weekday}, <span className='date'>{date}</span></div>
                </div>
                <div className='temp'>{Math.round(data.main.temp)}*<span className="unit">C</span></div>
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
            <button type="submit">Search</button>
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
    var temp = `${data.main && Math.round(data.main.temp)}*C(${data.weather && data.weather[0].main})`;
    var humidity = `${data.main && data.main.humidity}%`;
    var wind_speed = `${data.wind && data.wind.speed} Km/h`;
    var visibility = `${data.visibility && data.visibility} mi`;
    return(
        <div className='details'>
            <div className='icon'>Icon</div>
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
    const [query,setQuery] = useState('');
    const [weather_data,setWeather_data] = useState({});
    const API_KEY = "be34786903c95d0d1839a0abe66dc19e"
    const API_key = API_KEY;
    var lat = 28.6333;
    var lon = 77.2167;
    async function makeApiCall(query){
        // get the location 
        var loc_url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${API_key}`
        console.log(loc_url)
        var {data} = await axios.get(loc_url)
        data = data[0];
        console.log(data.name,data.country,data.lat,data.lon) 
        lat = data.lat;
        lon = data.lon;
        var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
        console.log(url)
        // get the weather data
        var data = await axios.get(url) 
        console.log(data.data)
        setWeather_data(data.data);
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