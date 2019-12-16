import React, { useState, useEffect } from 'react';
import useFuse from 'react-use-fuse';
import LoadingStatus from '../common/loading-status';
import Person from './Person';
import { API_ROOT } from '../common/envVars';

function People() {
  const [employees, setEmployees] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.IN_PROGRESS);
  const mergeDedupe = (arr) => [...new Set([].concat(...arr))];

  // set the searchable keys in the employees
  const options = {
    keys: ['first_name', 'last_name', 'skill_list'],
  };

  // sets up the fuse hook
  const {
    result, search, term, reset,
  } = useFuse({
    data: employees,
    options,
  });

  const convertStringsToObject = (array) => {
    const objectWithLabels = [];

    array.forEach((prop) => {
      const skillForList = {};
      skillForList.label = prop;
      skillForList.value = prop;
      objectWithLabels.push(skillForList);
    });

    return objectWithLabels;
  };

  // set the whole list to be the initial search results
  useEffect(() => {
    reset();

    if (employees.length > 0) {
      const pureList = mergeDedupe([
        ...employees.map((employee) => [].concat(...[], employee.skill_list)),
      ]);


      setSkills(convertStringsToObject(pureList));
    }
  }, [employees]);

  // prepping to update the skills list from within the person component
  useEffect(() => {
    setLoadingStatus(LoadingStatus.SUCCESS);
  }, [skills]);

  // make the API call
  useEffect(() => {
    const endpoint = `${API_ROOT}/employees`;

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
                personSkills={convertStringsToObject(person.skill_list)}
                allSkills={skills}
              />
            ))}
          </div>
        </>
      );
  }
}

export default People;
