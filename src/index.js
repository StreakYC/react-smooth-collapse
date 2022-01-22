/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import getTransitionTimeMs from './getTransitionTimeMs';

export type Props = {
  children?: React.Node;
  expanded: boolean;
  onChangeEnd?: ?() => void;
  collapsedHeight: string;
  heightTransition: string;
  className: string;
  allowOverflowWhenOpen: boolean;
  eagerRender: boolean;
};
type State = {
  renderInner: boolean;
  closing: boolean;
  fullyClosed: boolean;
  height: string;
};

export default class SmoothCollapse extends React.Component<Props,State> {
  _removeTransitionEndListener = () => {};
  _main = React.createRef<HTMLDivElement>();
  _inner = React.createRef<HTMLDivElement>();
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onChangeEnd: PropTypes.func,
    collapsedHeight: PropTypes.string,
    heightTransition: PropTypes.string,
    className: PropTypes.string,
    allowOverflowWhenOpen: PropTypes.bool,
    eagerRender: PropTypes.bool
  };
  static defaultProps = {
    collapsedHeight: '0',
    heightTransition: '.25s ease',
    className: '',
    allowOverflowWhenOpen: false,
    eagerRender: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      renderInner: props.expanded || SmoothCollapse._visibleWhenClosed(props),
      closing: false,
      fullyClosed: !props.expanded,
      height: props.expanded ? 'auto' : props.collapsedHeight
    };
  }

  static _visibleWhenClosed(props: Props) {
    return props.eagerRender || parseFloat(props.collapsedHeight) !== 0;
  }

  componentWillUnmount() {
    this._removeTransitionEndListener();
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.expanded && (state.closing || state.fullyClosed)) {
      return {
        closing: false,
        fullyClosed: false,
        renderInner: true
      };
    } else if (!props.expanded && (state.closing || state.fullyClosed) && state.height !== props.collapsedHeight) {
      return {
        height: props.collapsedHeight,
        renderInner: state.renderInner || SmoothCollapse._visibleWhenClosed(props)
      };
    }
    return null;
  }

  _onNextTransitionEnd = (el: HTMLDivElement, callback: () => void) => {
    this._removeTransitionEndListener();

    const listener = () => {
      this._removeTransitionEndListener();
      callback();
    };

    let timeout;
    this._removeTransitionEndListener = () => {
      this._removeTransitionEndListener = () => {};
      clearTimeout(timeout);
      el.removeEventListener('transitionend', listener);
    };

    // Wait until the transitionend event, or until a timer goes off in
    // case the event doesn't fire because the browser doesn't support it
    // or the element is hidden before it happens. The timer is a little
    // longer than the transition is supposed to take to make sure we don't
    // cut the animation early while it's still going if the browser is
    // running it just a little slow.
    el.addEventListener('transitionend', listener);
    const ms = getTransitionTimeMs(this.props.heightTransition) * 1.1 + 500;
    timeout = setTimeout(listener, ms);
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.expanded && this.props.expanded) {
      this._removeTransitionEndListener();

      const mainEl = this._main.current;
      const innerEl = this._inner.current;
      if (!mainEl || !innerEl) throw new Error('Should not happen');

      // Set the collapser to the target height instead of auto so that it
      // animates correctly. Then switch it to 'auto' after the animation so
      // that it flows correctly if the page is resized.
      const targetHeight = `${innerEl.clientHeight}px`;
      this.setState({
        height: targetHeight
      });

      this._onNextTransitionEnd(mainEl, () => {
        this.setState({
          height: 'auto'
        }, () => {
          if (this.props.onChangeEnd) {
            this.props.onChangeEnd();
          }
        });
      });
    } else if (prevProps.expanded && !this.props.expanded) {
      this._removeTransitionEndListener();

      if (!this._inner.current) throw new Error('Should not happen');
      this.setState({
        height: `${this._inner.current.clientHeight}px`
      }, () => {
        const mainEl = this._main.current;
        if (!mainEl) throw new Error('Should not happen');

        mainEl.clientHeight; // force the page layout
        this.setState({
          height: this.props.collapsedHeight,
          closing: true
        });

        this._onNextTransitionEnd(mainEl, () => {
          this.setState({
            closing: false,
            fullyClosed: true
          });
          if (this.props.onChangeEnd) {
            this.props.onChangeEnd();
          }
        });
      });
    }
  }

  render() {
    const visibleWhenClosed = SmoothCollapse._visibleWhenClosed(this.props);
    const {
      allowOverflowWhenOpen, children, collapsedHeight, eagerRender, expanded,
      heightTransition, onChangeEnd, ...props
    } = this.props;
    const {height, fullyClosed, renderInner} = this.state;
    const innerEl = renderInner ?
      <div ref={this._inner} style={{
        overflow: allowOverflowWhenOpen && height === 'auto' ? 'visible' : 'hidden'
      }}>
        { children }
      </div>
      : null;

    return (
      <div
        {...props}
        ref={this._main}
        style={{
          height,
          overflow: allowOverflowWhenOpen && height === 'auto' ? 'visible' : 'hidden',
          display: (fullyClosed && !visibleWhenClosed) ? 'none': null,
          transition: `height ${heightTransition}`
        }}
      >
        {innerEl}
      </div>
    );
  }
}
