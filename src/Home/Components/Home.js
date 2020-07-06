import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { map, orderBy, toNumber, startCase, replace } from 'lodash';
import {
  Card,
  Grid,
  Button,
  TextField,
  Typography,
  CardContent,
} from '@material-ui/core';
import { searchAllPlanets, hitPlanetSearchUrl } from '../../SWAPI';

const Home = () => {
  let history = useHistory();
  const signal = axios.CancelToken.source();
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState({});
  const [error, setError] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    const searchInterval = setInterval(function () {
      setSearchCount(0);
      setError(false);
      console.log('Boom Interval');
    }, 60000);
    document.title = `Home | Swapi App`;
    return () => {
      clearInterval(searchInterval);
      signal.cancel('Request Cancelled');
    };
  }, []);

  const processData = (data) => {
    const results = map(
      orderBy(
        data.results,
        [
          (o) => {
            return toNumber(o.population);
          },
        ],
        ['asc']
      ),
      (value) => ({ ...value, isSelected: false })
    );
    console.log({ results });
    return { ...data, results };
  };

  const checkLogin = async (searchValue) => {
    try {
      const response = await searchAllPlanets(searchValue, signal.token);
      console.log(response);
      if (response && response.count > 0) {
        console.log('Search Successful', response.results);
        const data = processData(response);
        setSearchData({ ...data });
      } else {
        // setError(true);
        setSearchData({});
      }
    } catch (error) {
      console.log('API Error', error);
    }
  };

  const handleSearch = (e) => {
    const obj = localStorage.getItem('userName');
    console.log({ obj });
    if (
      !(
        localStorage.getItem('userName') &&
        localStorage.getItem('userName') === 'Luke Skywalker'
      ) &&
      searchCount >= 15
    ) {
      setError(true);
    } else {
      setSearchCount((prevData) => ++prevData);
      setSearchValue(e.target.value);
      checkLogin(e.target.value);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push('/login');
  };

  const hitUrl = async (url) => {
    try {
      const response = await hitPlanetSearchUrl(url, signal.token);
      console.log(response);
      if (response && response.count > 0) {
        const data = processData(response);
        setSearchData({ ...data });
      } else {
        // setError(true);
        setSearchData([]);
      }
    } catch (error) {
      console.log('API Error', error);
    }
  };

  const handlePagination = (url) => {
    hitUrl(replace(url, 'http', 'https'));
  };

  const handleCardClick = (index) => {
    console.log('handleCardClick', index);

    setSearchData((prevData) => {
      const results = map(prevData.results, (value, idx) => {
        if (index === idx) {
          return { ...value, isSelected: !value.isSelected };
        } else {
          return { ...value, isSelected: false };
        }
      });
      return { ...prevData, results };
    });
  };

  console.log(
    { searchData, searchCount },
    localStorage.getItem('userName') === 'Luke Skywalker'
  );

  return (
    <>
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12} sm={12}>
            <Typography color="error">Wait for 1 Minute</Typography>
          </Grid>
        )}
        <Grid item xs={10}>
          <TextField
            type="search"
            id="standard-search"
            label="Search Field"
            placeholder="Type to Search"
            name="Search Field"
            fullWidth
            value={searchValue}
            onChange={handleSearch}
            disabled={error}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Grid>
        {searchData.results && searchData.results.length > 0 ? (
          <>
            {map(searchData.results, (data, idx) => (
              <Grid key={idx + 1} item>
                <Card
                  variant="outlined"
                  style={
                    data.isSelected
                      ? {
                          width: '500px',
                          height: '500px',
                        }
                      : {
                          width: `${200 + 15 * idx}px`,
                          height: `${200 + 15 * idx}px`,
                        }
                  }
                  onClick={() => handleCardClick(idx)}
                >
                  <CardContent>
                    <Typography variant="h6">{data.name}</Typography>
                    {data.isSelected &&
                      map(data, (value, key) => (
                        <Typography variant="body1">
                          {`${startCase(key)} : ${value}`}
                        </Typography>
                      ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {(searchData.previous || searchData.next) && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePagination(searchData.previous)}
                  disabled={!searchData.previous}
                >
                  Prev
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePagination(searchData.next)}
                  disabled={!searchData.next}
                >
                  Next
                </Button>
              </>
            )}
          </>
        ) : (
          <Typography>No Search Results</Typography>
        )}
      </Grid>
    </>
  );
};

export default Home;
