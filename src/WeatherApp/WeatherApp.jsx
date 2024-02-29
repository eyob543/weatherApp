import { useCallback, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { faCloud, faCloudRain, faSnowflake, faSun, faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import './WeatherApp.css'

export default function WeatherApp(){
    const [unit, setUnit] = useState("M");
    const [cityName, setCityName] = useState("");
    const [weatherData, setWeatherData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
 
    useEffect(() => {
        const baseURL = 'https://api.weatherbit.io/v2.0/';
        const apiKey = "7a84c734e01f45888e4cbfd28b29e269";
        const endPoint = "forecast/daily";
        const apiUrl = `${baseURL}${endPoint}?city=${cityName === "" ? "Addis Ababa" : cityName}&key=${apiKey}&units=${unit}`;
        const getWeather = async () => {
            try{
                setIsLoading(true);
                const response = await fetch(apiUrl);
                const weatherData = await response.json();
                setWeatherData(weatherData.data)
            }catch(error){
                console.log({error});
                setIsLoading(false);
            }finally{
                setIsLoading(false);
            }
        }
        getWeather();
    }, [unit, cityName])



    function handleUnit(event){
        const newUnit = event.target.value;
        _.debounce(setUnit(newUnit),3000);
    }
    const handleChange = useCallback((event) => {
        const newCity = event.target.value;
        const splitted = _.split(newCity, " ");
        const formattedCity = _.map(splitted, _.capitalize);
        _.debounce(setCityName(formattedCity.join(" ")),6500);
    }, [])
    return(
        <div className="wrapper">
            <nav>
                <h1>Weather forecast</h1>
                <label>
                    Choose a unit: 
                <select name="" value={unit} onChange={handleUnit}>
                    <option value="M">Celcius</option>
                    <option value="S">Scientific</option>
                    <option value="I">Fahrenheit</option>
                </select>
                </label>
                <label>
                    Enter city:
                    <input 
                        type="text"
                        placeholder="Enter a city" 
                        onChange={handleChange}
                        value={cityName}   
                        />
                </label>
                <p className="city">Showing wheather forecast of {cityName !== "" ? cityName : "Addis Ababa"}</p>
               {isLoading && <p className="loading">Loading...</p>}    
            </nav>
            <div className="container">
                {
                    weatherData && 
                    weatherData.slice(0, 3).map((value, index) => {
                        let styleName = "";
                        const description = value.weather.description;
                        if(description.includes("snow")){
                            styleName = "snow";
                        }else if(description === "Heavy rain" || description.includes("Thunderstorm")){
                            styleName = "heavyRain";
                        }else if(description === "Scattered clouds"){
                            styleName = "scatteredClouds"
                        }else if(description.includes("clouds")){
                            styleName = "cloud";
                        }else if(description.includes("sun")){
                            styleName = "sunny";
                        }else if(description.includes("rain")){
                            styleName = "rain";
                        }
                       return(
                            <div className={`weather ${styleName}`}  key={index}>
                                    <p className="description">Description: {value.weather.description}</p>
                                    {styleName === "snow" && <FontAwesomeIcon className="snowIcon" icon={faSnowflake}/>}
                                    {styleName === "heavyRain" && 
                                        <div className="heavy">
                                            <FontAwesomeIcon className="rainIcon" icon={faCloudRain}/>
                                            <FontAwesomeIcon className="lightningIcon" icon={faBoltLightning}/>
                                        </div>
                                    }
                                    {styleName === "scatteredClouds" &&
                                     <div className="cloudContainer">
                                        <FontAwesomeIcon className="scatteredCloudIcon" icon={faCloud}/> 
                                        <FontAwesomeIcon className="scatteredCloudIcon" icon={faCloud}/>
                                     </div>
                                    }
                                    {styleName === "cloud" && <FontAwesomeIcon className="cloudIcon" icon={faCloud}/>}
                                    {styleName === "sunny" && <FontAwesomeIcon className="sunIcon" icon={faSun}/>}
                                    {styleName === "rain" && <FontAwesomeIcon className="rainIcon" icon={faCloudRain}/>}
                                    <p>Clouds: {value.clouds}</p>
                                    <p>Date: {value.datetime}</p>
                                    <p>Highest temperature: {value.high_temp}</p>
                                    <p>Lowest temperature: {value.low_temp}</p>
                                    <p>Moon phase: {value.moon_phase}</p>
                                    <p>Wind direction: {value.wind_cdir_full}</p>
                                    <p>Wind speed: {value.wind_spd}</p>
                            </div>
                       ) 
                    })
                }
            </div>
        </div>
    )
}