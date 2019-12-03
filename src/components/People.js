import React, { useState, useEffect } from 'react';
import LoadingStatus from '../common/loading-status';
import Person from './Person';

function People() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.IN_PROGRESS);

  // monitor the input search field
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // combines all search fields and removes duplicates
  const mergeDedupe = (arr) => [...new Set([].concat(...arr))];

  // when the search term changes, filter results
  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults(employees);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();

      const firstNameResults = employees.filter((employee) => employee.first_name.toLowerCase().includes(lowerSearchTerm));
      const lastNameResults = employees.filter((employee) => employee.last_name.toLowerCase().includes(lowerSearchTerm));
      const startDateResults = employees.filter((employee) => employee.start_date.toLowerCase().includes(lowerSearchTerm));
      const fieldStartDateResults = employees.filter((employee) => employee.field_start_date.toLowerCase().includes(lowerSearchTerm));
      const skillsResults = employees.filter((employee) => employee.skill_list.toString().toLowerCase().includes(lowerSearchTerm));

      setSearchResults(mergeDedupe([
        ...firstNameResults,
        ...lastNameResults,
        ...startDateResults,
        ...fieldStartDateResults,
        ...skillsResults,
      ]));
    }
  }, [searchTerm]);

  // set the whole list to be the initial search results
  useEffect(() => {
    setSearchResults(employees);
  }, [employees]);

  // make the API call
  useEffect(() => {
    const endpoint = 'https://employee-skillz.herokuapp.com/employees';

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
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="people">
            {searchResults.map((person) => (
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
