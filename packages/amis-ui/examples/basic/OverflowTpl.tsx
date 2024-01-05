import React from 'react';
import {OverflowTpl} from 'amis-ui';

export default function ButtonExamples() {
  return (
    <div className="wrapper">
      <div className="flex justify-items-start items-center">
        {[
          {text: 'Transforming business'},
          {
            text: "Innovating, creating, succeeding. Let's make a difference together."
          },
          {text: 'Bringing technology to the forefront'},
          {text: 'Driving change in the industry'},
          {text: 'Enriching the journey with'}
        ].map((item, index) => (
          <div
            className="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
            style={{maxWidth: '190px'}}
          >
            <OverflowTpl key={index} tooltip={item.text}>
              {item.text}
            </OverflowTpl>
          </div>
        ))}
      </div>
    </div>
  );
}
