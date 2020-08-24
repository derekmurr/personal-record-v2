import React from "react";

const RunList = ({ runData }) => {
  if (!runData.length) {
    return (
      <p>No runs to display yet!</p>
    );
  }


  return (
    <ul>
      {runData.map(run => (
        <li key={run.id}>{ run.distance }</li>
      ))}
    </ul>
  );
};

export default RunList;
