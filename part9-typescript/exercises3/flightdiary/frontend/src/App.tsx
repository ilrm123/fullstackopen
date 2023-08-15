import { useState, useEffect } from "react";
import axios from "axios";

import { apiBaseUrl } from "./constants";
import { DiaryEntry } from "./types";

import diaryService from "./services/diaries";

interface ValidationError {
  message: string;
  errors: Record<string, string[]>
}

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchDiaryList = async () => {
      const entries = await diaryService.getAll();
      setEntries(entries);
    };
    void fetchDiaryList();
  }, []);

  const [date, setDate] = useState('')
  const [visibility, setVisibility] = useState('great')
  const [weather, setWeather] = useState('sunny')
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary = {
      date: date,
      visibility: visibility,
      weather: weather,
      comment: comment
    }

    diaryService
      .create(newDiary)
      .then(response => {
        setEntries(entries.concat(response))
        setDate('')
        setVisibility('')
        setWeather('')
        setComment('')
        setMessage('')
      }).catch(error => {
        if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
          if (error.response != undefined) {
            setMessage(error.response.data.toString().substring(22));
          } else {setMessage("An unknown error occurred")}
        } else {
          setMessage(error.toString());
        }
      })
  };
  
  return (
    <div>
      <h1>Diary entries</h1>
      <br></br>
      
      <b><p style={{color: 'red'}}>{message}</p></b>


      <form onSubmit={addDiary}>
        Date: <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
        <br></br>
        Visibility:
         Great <input type="radio" name="visibility" checked value="great" onChange={(e) => setVisibility(e.target.value)}/>
        | Good <input type="radio" name="visibility" value="good" onChange={(e) => setVisibility(e.target.value)}/>
        | Ok <input type="radio" name="visibility" value="ok" onChange={(e) => setVisibility(e.target.value)}/>
        | Poor <input type="radio" name="visibility" value="poor" onChange={(e) => setVisibility(e.target.value)}/>
        <br></br>
        Weather:
         Sunny <input type="radio" name="weather" checked value="sunny" onChange={(e) => setWeather(e.target.value)}/>
        | Rainy <input type="radio" name="weather" value="rainy" onChange={(e) => setWeather(e.target.value)}/>
        | Cloudy <input type="radio" name="weather" value="cloudy" onChange={(e) => setWeather(e.target.value)}/>
        | Stormy <input type="radio" name="weather" value="stormy" onChange={(e) => setWeather(e.target.value)}/>
        | Windy <input type="radio" name="weather" value="windy" onChange={(e) => setWeather(e.target.value)}/>
        <br></br>
        Comment: <input value={comment} onChange={(e) => setComment(e.target.value)}/>
        <br></br>
        <button type='submit'>Add</button>
      </form>

      <br></br>
      <ul>
        {Object.values(entries).map((entry: DiaryEntry) => (
          <li key={entry.id}>
            <h2>Entry from {entry.date}</h2>
            <p>Visibility: {entry.visibility}</p>
            <p>Weather: {entry.weather}</p>
            <br></br>
          </li>
          ))}
      </ul>
    </div>
  );
};

export default App;
