import React, { useState, useEffect } from 'react'
import useFuse from 'react-use-fuse'
import LoadingStatus from '../common/loading-status'
import Person from './Person.jsx'
import { API_ROOT } from '../common/envVars'

function People() {
  const [employees, setEmployees] = useState([])
  const [skills, setSkills] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.IN_PROGRESS)
  const mergeDedupe = (arr) => [...new Set([].concat(...arr))]

  // set the searchable keys in the employees
  const options = {
    keys: ['first_name', 'last_name', 'skill_list'],
  }

  // sets up the fuse hook
  const { result, search, term, reset } = useFuse({
    data: employees,
    options,
  })

  // set the whole list to be the initial search results
  useEffect(() => {
    reset()

    const skillsWithLabels = []
    const pureList = mergeDedupe([
      ...employees.map((employee) => [].concat(...[], employee.skill_list)),
    ])

    pureList.forEach((prop) => {
      const skillForList = {}
      skillForList.label = prop
      skillForList.value = prop
      skillsWithLabels.push(skillForList)
    })

    setSkills(skillsWithLabels)
  }, [employees, reset])

  // make the API call
  useEffect(() => {
    const endpoint = `${API_ROOT}/employees`
    console.log('Fetching from endpoint:', endpoint)

    fetch(endpoint, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((response) => {
        console.log('API Response:', response)

        if (!response || response.data === null) {
          console.error('API response is null or invalid')
          setLoadingStatus(LoadingStatus.ERROR)
        } else if (Array.isArray(response)) {
          console.log('Setting employees with array response')
          setEmployees(response)
          setLoadingStatus(LoadingStatus.SUCCESS)
        } else if (response.data && Array.isArray(response.data)) {
          console.log('Setting employees with response.data')
          setEmployees(response.data)
          setLoadingStatus(LoadingStatus.SUCCESS)
        } else {
          console.error('Unexpected API response format')
          setLoadingStatus(LoadingStatus.ERROR)
        }
      })
      .catch((error) => {
        console.error('API fetch error:', error)
        setLoadingStatus(LoadingStatus.ERROR)
      })
  }, [])

  switch (loadingStatus) {
    case LoadingStatus.ERROR:
      return (
        <div className="people error">
          <h1>Houston, we have a problem.</h1>
        </div>
      )
    case LoadingStatus.IN_PROGRESS:
      return (
        <div className="people loading">
          <h1>Loading... beep boop....</h1>
        </div>
      )
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
                personSkills={person.skill_list}
                allSkills={skills}
              />
            ))}
          </div>
        </>
      )
  }
}

export default People
