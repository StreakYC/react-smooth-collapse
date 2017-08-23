/* @flow */
/* eslint-disable react/no-find-dom-node */

import sinon from 'sinon';
import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import SmoothCollapse from '../src';

test('works after starting closed', () => {
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

  expect(root.state.height).toBe('0');
  expect(rootEl.style.transition).toBe('height .25s ease');
  expect(rootEl.style.display).toBe('none');

  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(0);

  expect(onChangeEnd.notCalled).toBe(true);

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

  expect(rootEl.style.transition).toBe('height 4s ease-in-out 1s');
  expect(rootEl.style.display).toBe('');

  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.notCalled).toBe(true);
  expect(rootEl.addEventListener.args[0][0]).toBe('transitionend');

  rootEl.addEventListener.args[0][1](); //fake transitionend

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.args[0][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[0][1])
    .toBe(rootEl.addEventListener.args[0][1]);

  expect(root.state.height).toBe('auto');
  expect(rootEl.style.display).toBe('');

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

  expect(root.state.height).toBe('0');
  expect(rootEl.style.display).toBe('');

  // Elements should still be there. If they were removed after being added
  // before, then they could lose any state.
  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(2);

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.addEventListener.args[1][0]).toBe('transitionend');

  rootEl.addEventListener.args[1][1](); //fake transitionend

  expect(rootEl.style.display).toBe('none');

  expect(onChangeEnd.calledTwice).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.args[1][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[1][1])
    .toBe(rootEl.addEventListener.args[1][1]);
});

test('works after starting opened', () => {
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

  expect(root.state.height).toBe('auto');
  expect(rootEl.style.display).toBe('');

  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(2);

  expect(onChangeEnd.notCalled).toBe(true);

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

  expect(root.state.height).toBe('0');
  expect(rootEl.style.display).toBe('');

  // Elements should still be there. If they were removed after being added
  // before, then they could lose any state.
  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.notCalled).toBe(true);
  expect(rootEl.addEventListener.args[0][0]).toBe('transitionend');

  rootEl.addEventListener.args[0][1](); //fake transitionend

  expect(rootEl.style.display).toBe('none');

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.args[0][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[0][1])
    .toBe(rootEl.addEventListener.args[0][1]);
});

it('works with collapse before expand finishes', function() {
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

  expect(root.state.height).toBe('0');
  expect(rootEl.style.display).toBe('none');

  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(0);

  expect(onChangeEnd.notCalled).toBe(true);

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

  expect(rootEl.style.display).toBe('');

  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.notCalled).toBe(true);
  expect(rootEl.addEventListener.args[0][0]).toBe('transitionend');

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
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.args[0][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[0][1])
    .toBe(rootEl.addEventListener.args[0][1]);

  expect(root.state.height).toBe('0');
  expect(rootEl.style.display).toBe('');

  // Elements should still be there. If they were removed after being added
  // before, then they could lose any state.
  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.addEventListener.args[1][0]).toBe('transitionend');

  rootEl.addEventListener.args[1][1](); //fake transitionend

  expect(rootEl.style.display).toBe('none');

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.args[1][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[1][1])
    .toBe(rootEl.addEventListener.args[1][1]);

  // We're still closed, right?
  expect(root.state.height).toBe('0');
});

it('works after starting closed with non-zero collapsedHeight', function() {
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

  expect(root.state.height).toBe('5px');
  expect(rootEl.style.transition).toBe('height .25s ease');
  expect(rootEl.style.display).toBe('');

  expect(TestUtils.scryRenderedDOMComponentsWithClass(root, 'foo').length)
    .toBe(2);

  expect(onChangeEnd.notCalled).toBe(true);
});
