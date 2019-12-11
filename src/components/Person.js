/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

function Person({
  name, start_date, field_start_date, personSkills, allSkills,
}) {
  const [skillsSelectOptions, setSkillsSelectOptions] = useState(personSkills);

  const createSelectOptions = (array) => {
    const skillsWithLabels = [];

    array.forEach((prop) => {
      const skillForList = {};
      skillForList.label = prop;
      skillForList.value = prop;
      skillsWithLabels.push(skillForList);
    });

    setSkillsSelectOptions(skillsWithLabels);
  };

  useEffect(() => {
    createSelectOptions(personSkills);
  }, [personSkills]);

  const handleChange = (selectedOptions) => {
    setSkillsSelectOptions(selectedOptions);
  };

  return (
    <div className={`person ${name}`}>
      <h1>&nbsp;{name}&nbsp; </h1>
      <h5>Started on</h5>
      <p>{start_date}</p>
      <h5>Been in the game since</h5>
      <p>{field_start_date}</p>

      <div className="add-remove-skills">
        <h5>Skills</h5>
        <Select options={allSkills} onChange={handleChange} value={skillsSelectOptions} isSearchable isMulti />
      </div>
    </div>
  );
}

export default Person;

Person.defaultProps = {
  name: 'Slackbot',
  start_date: '?',
  field_start_date: '?',
  personSkills: [],
};

Person.propTypes = {
  name: PropTypes.string,
  start_date: PropTypes.string,
  field_start_date: PropTypes.string,
  personSkills: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])),
  allSkills: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])).isRequired,
};
