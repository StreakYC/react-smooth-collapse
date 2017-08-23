/* @flow */
/* eslint-disable no-console, react/prop-types */

import React from 'react';
import SmoothCollapse from '../src';

export default class Example extends React.Component<{},*> {
  state: Object = {
    expanded: false
  };

  _toggle() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const {expanded} = this.state;

    return (
      <div className="main">
        <div className="intro">
          <p>
            This is a demonstration of the <a href="https://github.com/StreakYC/react-smooth-collapse">react-smooth-collapse</a> module.
          </p>
          <div>
            <input
              type="button"
              value={expanded ? 'Hide' : 'Show'}
              onClick={() => this._toggle()}
              />
          </div>
          <SmoothCollapse expanded={expanded}>
            <div className="contents">
              <div>You did it!</div>
              <div>
                The contents of the collapsed region is persisted.
                SmoothCollapse works with contents of varying heights. Try
                typing text in the following text area, resizing the text area,
                and toggling hiding and showing this region.
              </div>
              <textarea defaultValue="Lorem ipsum dolor sit amet..." />
            </div>
          </SmoothCollapse>
        </div>
      </div>
    );
  }
}
