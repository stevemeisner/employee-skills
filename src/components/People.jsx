import React, { useState, useEffect, useCallback } from 'react'
import useFuse from 'react-use-fuse'
import LoadingStatus from '../common/loading-status'
import Person from './Person.jsx'
import { API_ROOT } from '../common/envVars'

function People() {
  const [employees, setEmployees] = useState([])
  const [skills, setSkills] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.IN_PROGRESS)
  const [searchTerm, setSearchTerm] = useState('')

  // Improved mergeDedupe function to handle potentially undefined values
  const mergeDedupe = (arr) => {
    if (!arr || !arr.length) return []
    return [...new Set([].concat(...arr.filter(Boolean)))]
  }

  // set the searchable keys in the employees
  const options = {
    keys: ['first_name', 'last_name', 'skill_list'],
    threshold: 0.3, // Lower threshold means more strict matching
    includeScore: true,
    ignoreLocation: true,
  }

  // sets up the fuse hook with memoized data
  const { result, search } = useFuse({
    data: employees,
    options,
  })

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    search(value)
  }

  // Process skills list to ensure consistent format
  const processEmployees = useCallback((employeeList) => {
    return employeeList.map((employee) => ({
      ...employee,
      // Ensure skill_list is always an array
      skill_list: Array.isArray(employee.skill_list)
        ? employee.skill_list
        : employee.skill_list
        ? [employee.skill_list]
        : [],
    }))
  }, [])

  // set the whole list to be the initial search results
  useEffect(() => {
    if (employees.length > 0) {
      try {
        const skillsWithLabels = []
        // Safely extract all skills with proper error handling
        const allSkillLists = employees
          .map((employee) =>
            Array.isArray(employee.skill_list) ? employee.skill_list : []
          )
          .filter((list) => list.length > 0)

        const pureList = mergeDedupe(allSkillLists)

        // Create properly formatted skill objects
        pureList.forEach((prop) => {
          if (prop && typeof prop === 'string') {
            const skillForList = {
              label: prop,
              value: prop,
            }
            skillsWithLabels.push(skillForList)
          }
        })

        setSkills(skillsWithLabels)
      } catch (error) {
        console.error('Error processing skills:', error)
      }
    }
  }, [employees])

  // make the API call
  useEffect(() => {
    const endpoint = `${API_ROOT}/employees`
    console.log('Fetching from endpoint:', endpoint)

    fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      credentials: 'omit',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`)
        }
        return res.json()
      })
      .then((response) => {
        console.log('API Response:', response)

        if (!response) {
          console.error('API response is null or invalid')
          setLoadingStatus(LoadingStatus.ERROR)
        } else if (Array.isArray(response)) {
          console.log('Setting employees with array response')
          setEmployees(processEmployees(response))
          setLoadingStatus(LoadingStatus.SUCCESS)
        } else if (response.data && Array.isArray(response.data)) {
          console.log('Setting employees with response.data')
          setEmployees(processEmployees(response.data))
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
  }, [processEmployees])

  // Determine if we have search results or show all employees
  const displayedEmployees =
    searchTerm && searchTerm.length > 0
      ? result.map((result) => result.item || result) // Extract the item property from Fuse results
      : employees

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
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="people">
            {displayedEmployees.map((person) => (
              <Person
                key={`${person.first_name}-${person.last_name}`}
                name={`${person.first_name} ${person.last_name}`}
                start_date={person.start_date}
                field_start_date={person.field_start_date}
                personSkills={person.skill_list || []}
                allSkills={skills}
              />
            ))}
          </div>
        </>
      )
  }
}

export default People
