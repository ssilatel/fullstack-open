import axios from "axios";
import { useState, useEffect } from "react";

const Weather = ({ city }) => {
    const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const [weather, setWeather] = useState([]);

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`)
            .then((response) => {
                setWeather(response.data);
            });
    }, []);

    return (
        <div>
            {weather.main ? 
            <div>
                <h2>Weather in {city}</h2> 
                <p>temperature {weather.main.temp} Celsius</p>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png}`} alt={"weather icon"} />
                <p>wind {weather.wind.speed} m/s</p>
            </div>
            : <div>...loading</div>}
        </div>
    )
}

const Country = ({ country }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h4>languages:</h4>
            <ul>
                {Object.values(country.languages).map(l =>
                    <li key={l}>{l}</li>
                )}
            </ul>
            <img src={country.flags.png} alt={`${country.name.common}'s flag`} />
            <Weather city={country.capital} />
        </div>
    )
}

const Countries = ({ countriesToShow, setCountriesToShow }) => {
    return (
        <div>
            {countriesToShow.map(c => 
                <div key={c.cca3}>
                    {c.name.common} <button onClick={() => setCountriesToShow([c])}>show</button>
                </div>
            )}
        </div>
    )
}

const App = () => {
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState("");
    const [countriesToShow, setCountriesToShow] = useState([]);
    
    useEffect(() => {
        axios
            .get("https://restcountries.com/v3.1/all")
            .then(response => {
                setCountries(response.data);
            });
    }, []);

    const handleChange = (event) => {
        const query = event.target.value;
        setFilter(query);
        if (query === "") {
            setCountriesToShow([]);
        } else {
            setCountriesToShow(countries.filter(country =>
                country.name.common.toLowerCase().includes(query.toLowerCase())
            ));
        }
    }

    return (
        <div>
            <div>
                find countries <input value={filter} onChange={handleChange} />
            </div>
            {countriesToShow.length === 0 ? null
            : countriesToShow.length === 1 ? (
                <Country country={countriesToShow[0]} />
            ) : countriesToShow.length > 10 ? (
                <div>Too many matches, specify another filter</div>
            ) : (
                <Countries countriesToShow={countriesToShow} setCountriesToShow={setCountriesToShow} />
            )}
        </div>
    )
}

export default App;