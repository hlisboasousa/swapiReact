import React, { useState } from "react";

const getConsumableInDays = (consumables) => {
  const consumableArray = consumables.split(' ');
  const intervalValue = consumableArray[0];
  const intervalType = consumableArray[1][0];

  switch (intervalType) {
    case 'd':
      return intervalValue * 1;
    case 'w':
      return intervalValue * 7;
    case 'm':
      return intervalValue * 30;
    case 'y':
      return intervalValue * 365;
    default:
      console.log('Invalid type of interval consumable');
  }
}

const calculateNumberOfStops = (distance, MGLT, consumables) => {
  if (consumables === 'unknown' || MGLT === 'unknown') {
    return 'desconhecido'
  } else {
    const numberOfStops = Math.floor(distance / Number(MGLT) / 24 / getConsumableInDays(consumables));
    return numberOfStops;
  }
}

const App = () => {
  const [swapiData, setSwapiData] = useState(null);
  const [distance, setDistance] = useState(null);

  const formatData = (data) => {
    data.results = data.results.map(({ name, MGLT, consumables }) => ({
      name,
      numberOfStops: calculateNumberOfStops(distance, MGLT, consumables)
    }));
    setSwapiData(data);
  }

  const getData = async () => {
    const response = await fetch(`https://swapi.dev/api/starships/`);
    const data = await response.json();
    formatData(data);
  };

  const getPage = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    formatData(data);
  };

  return (
    <div className="App">
      <label>Digite uma distância em MGLT</label><br />
      <input type="number" id="distance" onChange={() => setDistance((document.getElementById('distance').value))} /><br/><br/>
      <button onClick={() => getData()}>Calcular</button>
      {swapiData &&
        swapiData.results.map((item, index) =>
          <p key={index}>{item.name}: {item.numberOfStops}</p>
        )}
      {swapiData && (swapiData.next || swapiData.previous) ? (
        <div>
          <button
            disabled={!swapiData.previous}
            onClick={() => getPage(swapiData.previous)}
          >
            anterior
          </button>
          <button
            disabled={!swapiData.next}
            onClick={() => getPage(swapiData.next)}
          >
            próxima
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;