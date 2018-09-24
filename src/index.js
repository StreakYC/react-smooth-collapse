/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import Kefir from 'kefir';
import kefirBus from 'kefir-bus';

import getTransitionTimeMs from './getTransitionTimeMs';

export type Props = {
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
  _resetter = kefirBus();
  _main = React.createRef<'div'>();
  _inner = React.createRef<'div'>();
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
    this._resetter.emit(null);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.expanded && state.fullyClosed) {
      return {
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.expanded && this.props.expanded) {
      this._resetter.emit(null);

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

      // Wait until the transitionend event, or until a timer goes off in
      // case the event doesn't fire because the browser doesn't support it
      // or the element is hidden before it happens. The timer is a little
      // longer than the transition is supposed to take to make sure we don't
      // cut the animation early while it's still going if the browser is
      // running it just a little slow.
      Kefir.fromEvents(mainEl, 'transitionend')
        .merge(Kefir.later(getTransitionTimeMs(this.props.heightTransition)*1.1 + 500))
        .takeUntilBy(this._resetter)
        .take(1)
        .onValue(() => {
          this.setState({
            height: 'auto'
          }, () => {
            if (this.props.onChangeEnd) {
              this.props.onChangeEnd();
            }
          });
        });
    } else if (prevProps.expanded && !this.props.expanded) {
      this._resetter.emit(null);

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

        // See comment above about previous use of transitionend event.
        Kefir.fromEvents(mainEl, 'transitionend')
          .merge(Kefir.later(getTransitionTimeMs(this.props.heightTransition)*1.1 + 500))
          .takeUntilBy(this._resetter)
          .take(1)
          .onValue(() => {
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
    const {allowOverflowWhenOpen} = this.props;
    const {height, fullyClosed, renderInner} = this.state;
    const innerEl = renderInner ?
      <div ref={this._inner} style={{
        overflow: allowOverflowWhenOpen && height === 'auto' ? 'visible' : 'hidden'
      }}>
        { (this.props:any).children }
      </div>
      : null;

    return (
      <div
        ref={this._main}
        className={this.props.className}
        style={{
          height,
          overflow: allowOverflowWhenOpen && height === 'auto' ? 'visible' : 'hidden',
          display: (fullyClosed && !visibleWhenClosed) ? 'none': null,
          transition: `height ${this.props.heightTransition}`
        }}
      >
        {innerEl}
      </div>
    );
  }
}
