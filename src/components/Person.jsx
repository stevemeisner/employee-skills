import React from 'react'
import PropTypes from 'prop-types'

const Person = ({ name, start_date, field_start_date, personSkills }) => {
  const formatDate = (rawDate) => {
    if (!rawDate) return ''
    const date = new Date(rawDate)
    const year = date.getFullYear()
    const month = date.toLocaleString('default', { month: 'long' })
    const day = date.getDate()
    return `${month} ${day}, ${year}`
  }

  const formatDateReadable = (date) => {
    if (!date) return ''
    const now = new Date()
    const then = new Date(date)
    const diffTime = Math.abs(now - then)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffYears = Math.floor(diffDays / 365)
    const remainingDays = diffDays % 365
    const diffMonths = Math.floor(remainingDays / 30)

    return `${diffYears} years, ${diffMonths} months`
  }

  const formattedStartDate = formatDate(start_date)
  const formattedFieldDate = formatDate(field_start_date)
  const timeSinceHire = formatDateReadable(start_date)
  const timeSinceField = formatDateReadable(field_start_date)

  return (
    <div className={`person ${name}`}>
      <h1>{name}</h1>
      <h5 className="start-date">Started: {formattedStartDate}</h5>
      <h5 className="field-date">Field: {formattedFieldDate}</h5>
      <h5 className="field-time">Time in field: {timeSinceField}</h5>
      <h5 className="hire-time">Time at company: {timeSinceHire}</h5>
      <div className="add-remove-skills">
        <h5>Skills</h5>
        <ul>
          {personSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

Person.propTypes = {
  name: PropTypes.string.isRequired,
  start_date: PropTypes.string,
  field_start_date: PropTypes.string,
  personSkills: PropTypes.arrayOf(PropTypes.string),
  allSkills: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
}

Person.defaultProps = {
  start_date: '',
  field_start_date: '',
  personSkills: [],
  allSkills: [],
}

export default Person
