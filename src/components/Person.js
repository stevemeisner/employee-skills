/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

function Person(props) {
  const {
    name, start_date, field_start_date, skill_list,
  } = props;

  return (
    <div className={`person ${name}`}>
      <h1>{name}</h1>
      <h5>Started on</h5>
      <p>{start_date}</p>
      <h5>Been in the game since</h5>
      <p>{field_start_date}</p>
      {skill_list.length ? (
        <div>
          <h5>Skills</h5>
          <ul>
            {skill_list.map((el) => <li key={el}>{el}</li>)}
          </ul>
        </div>
      ) : null}
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
};
