import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

function Person({
  name, start_date, field_start_date, skill_list, allSkills,
}) {
  return (
    <div className={`person ${name}`}>
      <h1>&nbsp;{name}&nbsp; </h1>
      <h5>Started on</h5>
      <p>{start_date}</p>
      <h5>Been in the game since</h5>
      <p>{field_start_date}</p>
      {skill_list.length ? (
        <div>
          <h5>Skills</h5>
          <ul>
            {skill_list.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
        </div>
      ) : null}

      <div className="add-remove-skills">
        <Select options={allSkills} />
      </div>
    </div>
  );
}

export default Person;

Person.defaultProps = {
  name: 'Slackbot',
  start_date: '?',
  field_start_date: '?',
  skill_list: [],
};

Person.propTypes = {
  name: PropTypes.string,
  start_date: PropTypes.string,
  field_start_date: PropTypes.string,
  skill_list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])),
  allSkills: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])).isRequired,
};
