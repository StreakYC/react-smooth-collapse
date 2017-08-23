/* @flow */
/* eslint-disable react/no-find-dom-node */

import './lib/testdom';
import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import SmoothCollapse from '../src';

describe('SmoothCollapse', function() {

  it('works after starting closed', function() {
    this.slow();

    const onChangeEnd = sinon.spy();

    const div = document.createElement('div');

    const root: SmoothCollapse = (ReactDOM.render(
      <SmoothCollapse
        expanded={false}
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    ): any);

    const rootEl: any = findDOMNode(root);
    sinon.spy(rootEl, 'addEventListener');
    sinon.spy(rootEl, 'removeEventListener');

    assert.strictEqual(root.state.height, '0');
    assert.strictEqual(rootEl.style.transition, 'height .25s ease');
    assert.strictEqual(rootEl.style.display, 'none');

    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      0
    );

    assert(onChangeEnd.notCalled);

    // EXPAND IT

    ReactDOM.render(
      <SmoothCollapse
        expanded={true}
        onChangeEnd={onChangeEnd}
        heightTransition="4s ease-in-out 1s"
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    );

    assert.strictEqual(rootEl.style.transition, 'height 4s ease-in-out 1s');
    assert.strictEqual(rootEl.style.display, '');

    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      2
    );

    assert(onChangeEnd.notCalled);
    assert(rootEl.addEventListener.calledOnce);
    assert(rootEl.removeEventListener.notCalled);
    assert.strictEqual(rootEl.addEventListener.args[0][0], 'transitionend');

    rootEl.addEventListener.args[0][1](); //fake transitionend

    assert(onChangeEnd.calledOnce);
    assert(rootEl.addEventListener.calledOnce);
    assert(rootEl.removeEventListener.calledOnce);
    assert.strictEqual(rootEl.removeEventListener.args[0][0], 'transitionend');
    assert.strictEqual(
      rootEl.removeEventListener.args[0][1],
      rootEl.addEventListener.args[0][1]
    );

    assert.strictEqual(root.state.height, 'auto');
    assert.strictEqual(rootEl.style.display, '');

    // CLOSE IT

    ReactDOM.render(
      <SmoothCollapse
        expanded={false}
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    );

    assert.strictEqual(root.state.height, '0');
    assert.strictEqual(rootEl.style.display, '');

    // Elements should still be there. If they were removed after being added
    // before, then they could lose any state.
    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      2
    );

    assert(onChangeEnd.calledOnce);
    assert(rootEl.addEventListener.calledTwice);
    assert(rootEl.removeEventListener.calledOnce);
    assert.strictEqual(rootEl.addEventListener.args[1][0], 'transitionend');

    rootEl.addEventListener.args[1][1](); //fake transitionend

    assert.strictEqual(rootEl.style.display, 'none');

    assert(onChangeEnd.calledTwice);
    assert(rootEl.addEventListener.calledTwice);
    assert(rootEl.removeEventListener.calledTwice);
    assert.strictEqual(rootEl.removeEventListener.args[1][0], 'transitionend');
    assert.strictEqual(
      rootEl.removeEventListener.args[1][1],
      rootEl.addEventListener.args[1][1]
    );
  });

  it('works after starting opened', function() {
    this.slow();

    const onChangeEnd = sinon.spy();

    const div = document.createElement('div');

    const root: SmoothCollapse = (ReactDOM.render(
      <SmoothCollapse
        expanded={true}
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    ): any);

    const rootEl: any = findDOMNode(root);
    sinon.spy(rootEl, 'addEventListener');
    sinon.spy(rootEl, 'removeEventListener');

    assert.strictEqual(root.state.height, 'auto');
    assert.strictEqual(rootEl.style.display, '');

    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      2
    );

    assert(onChangeEnd.notCalled);

    // CLOSE IT

    ReactDOM.render(
      <SmoothCollapse
        expanded={false}
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    );

    assert.strictEqual(root.state.height, '0');
    assert.strictEqual(rootEl.style.display, '');

    // Elements should still be there. If they were removed after being added
    // before, then they could lose any state.
    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      2
    );

    assert(onChangeEnd.notCalled);
    assert(rootEl.addEventListener.calledOnce);
    assert(rootEl.removeEventListener.notCalled);
    assert.strictEqual(rootEl.addEventListener.args[0][0], 'transitionend');

    rootEl.addEventListener.args[0][1](); //fake transitionend

    assert.strictEqual(rootEl.style.display, 'none');

    assert(onChangeEnd.calledOnce);
    assert(rootEl.addEventListener.calledOnce);
    assert(rootEl.removeEventListener.calledOnce);
    assert.strictEqual(rootEl.removeEventListener.args[0][0], 'transitionend');
    assert.strictEqual(
      rootEl.removeEventListener.args[0][1],
      rootEl.addEventListener.args[0][1]
    );
  });

  it('works with collapse before expand finishes', function() {
    this.slow();

    const onChangeEnd = sinon.spy();

    const div = document.createElement('div');

    const root: SmoothCollapse = (ReactDOM.render(
      <SmoothCollapse
        expanded={false}
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    ): any);

    const rootEl: any = findDOMNode(root);
    sinon.spy(rootEl, 'addEventListener');
    sinon.spy(rootEl, 'removeEventListener');

    assert.strictEqual(root.state.height, '0');
    assert.strictEqual(rootEl.style.display, 'none');

    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      0
    );

    assert(onChangeEnd.notCalled);

    // EXPAND IT

    ReactDOM.render(
      <SmoothCollapse
        expanded={true}
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    );

    assert.strictEqual(rootEl.style.display, '');

    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      2
    );

    assert(onChangeEnd.notCalled);
    assert(rootEl.addEventListener.calledOnce);
    assert(rootEl.removeEventListener.notCalled);
    assert.strictEqual(rootEl.addEventListener.args[0][0], 'transitionend');

    // Don't signal transitionend yet

    // CLOSE IT

    ReactDOM.render(
      <SmoothCollapse
        expanded={false}
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    );

    // Should have unsubscribed from waiting for the transitionend for the
    // open.
    assert(rootEl.removeEventListener.calledOnce);
    assert.strictEqual(rootEl.removeEventListener.args[0][0], 'transitionend');
    assert.strictEqual(
      rootEl.removeEventListener.args[0][1],
      rootEl.addEventListener.args[0][1]
    );

    assert.strictEqual(root.state.height, '0');
    assert.strictEqual(rootEl.style.display, '');

    // Elements should still be there. If they were removed after being added
    // before, then they could lose any state.
    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      2
    );

    assert(onChangeEnd.notCalled);
    assert(rootEl.addEventListener.calledTwice);
    assert(rootEl.removeEventListener.calledOnce);
    assert.strictEqual(rootEl.addEventListener.args[1][0], 'transitionend');

    rootEl.addEventListener.args[1][1](); //fake transitionend

    assert.strictEqual(rootEl.style.display, 'none');

    assert(onChangeEnd.calledOnce);
    assert(rootEl.addEventListener.calledTwice);
    assert(rootEl.removeEventListener.calledTwice);
    assert.strictEqual(rootEl.removeEventListener.args[1][0], 'transitionend');
    assert.strictEqual(
      rootEl.removeEventListener.args[1][1],
      rootEl.addEventListener.args[1][1]
    );

    // We're still closed, right?
    assert.strictEqual(root.state.height, '0');
  });

  it('works after starting closed with non-zero collapsedHeight', function() {
    this.slow();

    const onChangeEnd = sinon.spy();

    const div = document.createElement('div');

    const root: SmoothCollapse = (ReactDOM.render(
      <SmoothCollapse
        expanded={false}
        collapsedHeight="5px"
        onChangeEnd={onChangeEnd}
      >
        <div className="foo">bar</div>
        <div className="foo">more bar</div>
      </SmoothCollapse>,
      div
    ): any);

    const rootEl: any = findDOMNode(root);
    sinon.spy(rootEl, 'addEventListener');
    sinon.spy(rootEl, 'removeEventListener');

    assert.strictEqual(root.state.height, '5px');
    assert.strictEqual(rootEl.style.transition, 'height .25s ease');
    assert.strictEqual(rootEl.style.display, '');

    assert.strictEqual(
      TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length,
      2
    );

    assert(onChangeEnd.notCalled);
  });
});
