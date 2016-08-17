/* @flow */

import React, {PropTypes} from 'react';
import Kefir from 'kefir';
import kefirBus from 'kefir-bus';

type Props = {
  expanded: boolean;
  onChangeEnd?: ?() => void;
  collapsedHeight: string;
  heightTransition: string;
};
type State = {
  hasBeenVisibleBefore: boolean;
  fullyClosed: boolean;
  height: string;
};
type DefaultProps = {
  collapsedHeight: string;
  heightTransition: string;
};

export default class SmoothCollapse extends React.Component {
  _resetter: Object = kefirBus();
  props: Props;
  state: State;
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onChangeEnd: PropTypes.func,
    collapsedHeight: PropTypes.string,
    heightTransition: PropTypes.string
  };
  static defaultProps: DefaultProps = {
    collapsedHeight: '0',
    heightTransition: '.25s ease'
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
        // Set the collapser to the target height instead of auto so that it
        // animates correctly. Then switch it to 'auto' after the animation so
        // that it flows correctly if the page is resized.
        const targetHeight = `${this.refs.inner.clientHeight}px`;
        this.setState({
          height: targetHeight
        });

        Kefir.fromEvents(this.refs.main, 'transitionend')
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

      this.setState({
        height: `${this.refs.inner.clientHeight}px`
      }, () => {
        this.refs.main.clientHeight; // force the page layout
        this.setState({
          height: nextProps.collapsedHeight
        });

        Kefir.fromEvents(this.refs.main, 'transitionend')
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
      <div ref="inner" style={{overflow: 'hidden'}}>
        { (this.props:any).children }
      </div>
      : null;

    return (
      <div
        ref="main"
        style={{
          height, overflow: 'hidden',
          display: (fullyClosed && !visibleWhenClosed) ? 'none': null,
          transition: `height ${this.props.heightTransition}`
        }}
        >
        {innerEl}
      </div>
    );
  }
}
