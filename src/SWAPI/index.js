import axios from 'axios';

const URL = process.env.REACT_APP_SWAPI_URL;

const searchAllPeople = async (username, cancelToken) => {
  const URI = URL.concat(`/people/?search=${username}`);
  try {
    const { data } = await axios.get(URI, {
      cancelToken,
    });
    return data;
  } catch (error) {
    return error;
  }
};

const searchAllPlanets = async (username, cancelToken) => {
  const URI = URL.concat(`/planets/?search=${username}`);
  try {
    const { data } = await axios.get(URI, {
      cancelToken,
    });
    return data;
  } catch (error) {
    return error;
  }
};

const hitPlanetSearchUrl = async (url, cancelToken) => {
  try {
    const { data } = await axios.get(url, {
      cancelToken,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export { searchAllPeople, searchAllPlanets, hitPlanetSearchUrl };
