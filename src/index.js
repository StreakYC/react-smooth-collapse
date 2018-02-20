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
};
type State = {
  hasBeenVisibleBefore: boolean;
  fullyClosed: boolean;
  height: string;
};

export default class SmoothCollapse extends React.Component<Props,State> {
  _resetter = kefirBus();
  _mainEl: ?HTMLElement = null;
  _innerEl: ?HTMLElement = null;
  _mainElSetter = (el: ?HTMLElement) => {
    this._mainEl = el;
  };
  _innerElSetter = (el: ?HTMLElement) => {
    this._innerEl = el;
  };
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onChangeEnd: PropTypes.func,
    collapsedHeight: PropTypes.string,
    heightTransition: PropTypes.string,
    className: PropTypes.string
  };
  static defaultProps = {
    collapsedHeight: '0',
    heightTransition: '.25s ease',
    className: '',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasBeenVisibleBefore: props.expanded || this._visibleWhenClosed(),
      fullyClosed: !props.expanded,
      height: props.expanded ? 'auto' : props.collapsedHeight
    };
  }

  _visibleWhenClosed(props: ?Props) {
    if (!props) props = this.props;
    return parseFloat(props.collapsedHeight) !== 0;
  }

  componentWillUnmount() {
    this._resetter.emit(null);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.expanded && nextProps.expanded) {
      this._resetter.emit(null);

      // In order to expand, we need to know the height of the children, so we
      // need to setState first so they get rendered before we continue.

      this.setState({
        fullyClosed: false,
        hasBeenVisibleBefore: true
      }, () => {
        const mainEl = this._mainEl;
        const innerEl = this._innerEl;
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
          .merge(Kefir.later(getTransitionTimeMs(nextProps.heightTransition)*1.1 + 500))
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
      });

    } else if (this.props.expanded && !nextProps.expanded) {
      this._resetter.emit(null);

      if (!this._innerEl) throw new Error('Should not happen');
      this.setState({
        height: `${this._innerEl.clientHeight}px`
      }, () => {
        const mainEl = this._mainEl;
        if (!mainEl) throw new Error('Should not happen');

        mainEl.clientHeight; // force the page layout
        this.setState({
          height: nextProps.collapsedHeight
        });

        // See comment above about previous use of transitionend event.
        Kefir.fromEvents(mainEl, 'transitionend')
          .merge(Kefir.later(getTransitionTimeMs(nextProps.heightTransition)*1.1 + 500))
          .takeUntilBy(this._resetter)
          .take(1)
          .onValue(() => {
            this.setState({
              fullyClosed: true
            });
            if (this.props.onChangeEnd) {
              this.props.onChangeEnd();
            }
          });
      });
    } else if (!nextProps.expanded && this.props.collapsedHeight !== nextProps.collapsedHeight) {
      this.setState({
        hasBeenVisibleBefore:
          this.state.hasBeenVisibleBefore || this._visibleWhenClosed(nextProps),
        height: nextProps.collapsedHeight
      });
    }
  }

  render() {
    const visibleWhenClosed = this._visibleWhenClosed();
    const {height, fullyClosed, hasBeenVisibleBefore} = this.state;
    const innerEl = hasBeenVisibleBefore ?
      <div ref={this._innerElSetter} style={{overflow: height == 'auto' ? 'visible' : 'hidden'}}>
        { (this.props:any).children }
      </div>
      : null;

    return (
      <div
        ref={this._mainElSetter}
        className={this.props.className}
        style={{
          height, overflow: height == 'auto' ? 'visible' : 'hidden',
          display: (fullyClosed && !visibleWhenClosed) ? 'none': null,
          transition: `height ${this.props.heightTransition}`
        }}
      >
        {innerEl}
      </div>
    );
  }
}
