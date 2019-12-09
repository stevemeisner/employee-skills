import React, { useState, useEffect } from 'react';
import useFuse from 'react-use-fuse';
import LoadingStatus from '../common/loading-status';
import Person from './Person';

function People() {
  const [employees, setEmployees] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.IN_PROGRESS);

  const options = {
    keys: ['first_name', 'last_name', 'skill_list'],
  };

  const {
    result, search, term, reset,
  } = useFuse({
    data: employees,
    options,
  });

  // set the whole list to be the initial search results
  useEffect(() => {
    reset();
  }, [employees]);

  // make the API call
  useEffect(() => {
    const endpoint = 'http://localhost:3000/employees';

    fetch(endpoint, {
      header: { 'Access-Control-Allow-Origin': '*' },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.data === null) {
          setLoadingStatus(LoadingStatus.ERROR);
        } else {
          setEmployees(response);
          setLoadingStatus(LoadingStatus.SUCCESS);
        }
      })
      .catch(() => {
        setLoadingStatus(LoadingStatus.ERROR);
      });
  }, []);

  switch (loadingStatus) {
    case LoadingStatus.ERROR:
      return (
        <div className="people error">
          <h1>Houston, we have a problem.</h1>
        </div>
      );
    case LoadingStatus.IN_PROGRESS:
      return (
        <div className="people loading">
          <h1>Loading... beep boop....</h1>
        </div>
      );
    default:
      return (
        <>
          <div className="search">
            <input
              type="text"
              placeholder="Search skills or names..."
              value={term}
              onChange={(e) => search(e.target.value)}
            />
          </div>
          <div className="people">
            {result.map((person) => (
              <Person
                key={`${person.first_name}-${person.last_name}`}
                name={`${person.first_name} ${person.last_name}`}
                start_date={person.start_date}
                field_start_date={person.field_start_date}
                skill_list={person.skill_list}
              />
            ))}
          </div>
        </>
      );
  }
}

export default People;
