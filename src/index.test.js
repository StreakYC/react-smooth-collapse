/*
 * @flow
 * @jest-environment jsdom
 */

import sinon from 'sinon';
import React, {createRef, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import SmoothCollapse from '../src';

(global: any).IS_REACT_ACT_ENVIRONMENT = true;

test('works after starting closed', () => {
  const onChangeEnd = sinon.spy();

  const div = document.createElement('div');

  const smoothCollapseRef = createRef<SmoothCollapse>();
  const root = createRoot(div);
  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={false}
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  const smoothCollapse = smoothCollapseRef.current;
  if (!smoothCollapse) throw new Error();
  const rootEl: HTMLElement = (div.firstElementChild: any);
  sinon.spy(rootEl, 'addEventListener');
  sinon.spy(rootEl, 'removeEventListener');

  expect(smoothCollapse.state.height).toBe('0');
  expect(rootEl.style.transition).toBe('height .25s ease');
  expect(rootEl.style.display).toBe('none');

  expect(div.querySelectorAll('.foo')).toHaveLength(0);

  expect(onChangeEnd.notCalled).toBe(true);

  // EXPAND IT

  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={true}
          onChangeEnd={onChangeEnd}
          heightTransition="4s ease-in-out 1s"
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  expect(rootEl.style.transition).toBe('height 4s ease-in-out 1s');
  expect(rootEl.style.display).toBe('');

  expect(div.querySelectorAll('.foo')).toHaveLength(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.notCalled).toBe(true);
  expect(rootEl.addEventListener.args[0][0]).toBe('transitionend');

  act(() => {
    rootEl.addEventListener.args[0][1](); //fake transitionend
  });

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.args[0][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[0][1])
    .toBe(rootEl.addEventListener.args[0][1]);

  expect(smoothCollapse.state.height).toBe('auto');
  expect(rootEl.style.display).toBe('');

  // CLOSE IT

  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={false}
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  expect(smoothCollapse.state.height).toBe('0');
  expect(rootEl.style.display).toBe('');

  // Elements should still be there. If they were removed after being added
  // before, then they could lose any state.
  expect(div.querySelectorAll('.foo')).toHaveLength(2);

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.addEventListener.args[1][0]).toBe('transitionend');

  act(() => {
    rootEl.addEventListener.args[1][1](); //fake transitionend
  });

  expect(rootEl.style.display).toBe('none');

  expect(onChangeEnd.calledTwice).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.args[1][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[1][1])
    .toBe(rootEl.addEventListener.args[1][1]);

  act(() => root.unmount());
});

test('works after starting opened', () => {
  const onChangeEnd = sinon.spy();

  const div = document.createElement('div');

  const smoothCollapseRef = createRef<SmoothCollapse>();
  const root = createRoot(div);
  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={true}
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  const smoothCollapse = smoothCollapseRef.current;
  if (!smoothCollapse) throw new Error();
  const rootEl: HTMLElement = (div.firstElementChild: any);
  sinon.spy(rootEl, 'addEventListener');
  sinon.spy(rootEl, 'removeEventListener');

  expect(smoothCollapse.state.height).toBe('auto');
  expect(rootEl.style.display).toBe('');

  expect(div.querySelectorAll('.foo')).toHaveLength(2);

  expect(onChangeEnd.notCalled).toBe(true);

  // CLOSE IT

  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={false}
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  expect(smoothCollapse.state.height).toBe('0');
  expect(rootEl.style.display).toBe('');

  // Elements should still be there. If they were removed after being added
  // before, then they could lose any state.
  expect(div.querySelectorAll('.foo')).toHaveLength(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.notCalled).toBe(true);
  expect(rootEl.addEventListener.args[0][0]).toBe('transitionend');

  act(() => {
    rootEl.addEventListener.args[0][1](); //fake transitionend
  });

  expect(rootEl.style.display).toBe('none');

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.args[0][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[0][1])
    .toBe(rootEl.addEventListener.args[0][1]);

  act(() => root.unmount());
});

it('works with collapse before expand finishes', () => {
  const onChangeEnd = sinon.spy();

  const div = document.createElement('div');

  const smoothCollapseRef = createRef<SmoothCollapse>();
  const root = createRoot(div);
  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={false}
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  const smoothCollapse = smoothCollapseRef.current;
  if (!smoothCollapse) throw new Error();
  const rootEl: HTMLElement = (div.firstElementChild: any);
  sinon.spy(rootEl, 'addEventListener');
  sinon.spy(rootEl, 'removeEventListener');

  expect(smoothCollapse.state.height).toBe('0');
  expect(rootEl.style.display).toBe('none');

  expect(div.querySelectorAll('.foo')).toHaveLength(0);

  expect(onChangeEnd.notCalled).toBe(true);

  // EXPAND IT

  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={true}
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  expect(rootEl.style.display).toBe('');

  expect(div.querySelectorAll('.foo')).toHaveLength(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.notCalled).toBe(true);
  expect(rootEl.addEventListener.args[0][0]).toBe('transitionend');

  // Don't signal transitionend yet

  // CLOSE IT

  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={false}
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  // Should have unsubscribed from waiting for the transitionend for the
  // open.
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.removeEventListener.args[0][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[0][1])
    .toBe(rootEl.addEventListener.args[0][1]);

  expect(smoothCollapse.state.height).toBe('0');
  expect(rootEl.style.display).toBe('');

  // Elements should still be there. If they were removed after being added
  // before, then they could lose any state.
  expect(div.querySelectorAll('.foo')).toHaveLength(2);

  expect(onChangeEnd.notCalled).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledOnce).toBe(true);
  expect(rootEl.addEventListener.args[1][0]).toBe('transitionend');

  act(() => {
    rootEl.addEventListener.args[1][1](); //fake transitionend
  });

  expect(rootEl.style.display).toBe('none');

  expect(onChangeEnd.calledOnce).toBe(true);
  expect(rootEl.addEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.calledTwice).toBe(true);
  expect(rootEl.removeEventListener.args[1][0]).toBe('transitionend');
  expect(rootEl.removeEventListener.args[1][1])
    .toBe(rootEl.addEventListener.args[1][1]);

  // We're still closed, right?
  expect(smoothCollapse.state.height).toBe('0');

  act(() => root.unmount());
});

it('works after starting closed with non-zero collapsedHeight', () => {
  const onChangeEnd = sinon.spy();

  const div = document.createElement('div');

  const smoothCollapseRef = createRef<SmoothCollapse>();
  const root = createRoot(div);
  act(() => {
    root.render(
      <StrictMode>
        <SmoothCollapse
          ref={smoothCollapseRef}
          expanded={false}
          collapsedHeight="5px"
          onChangeEnd={onChangeEnd}
        >
          <div className="foo">bar</div>
          <div className="foo">more bar</div>
        </SmoothCollapse>
      </StrictMode>
    );
  });

  const smoothCollapse = smoothCollapseRef.current;
  if (!smoothCollapse) throw new Error();
  const rootEl: HTMLElement = (div.firstElementChild: any);
  sinon.spy(rootEl, 'addEventListener');
  sinon.spy(rootEl, 'removeEventListener');

  expect(smoothCollapse.state.height).toBe('5px');
  expect(rootEl.style.transition).toBe('height .25s ease');
  expect(rootEl.style.display).toBe('');

  expect(div.querySelectorAll('.foo')).toHaveLength(2);

  expect(onChangeEnd.notCalled).toBe(true);

  act(() => root.unmount());
});
