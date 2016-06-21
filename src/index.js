/* @flow */

import React, {PropTypes} from 'react';
import Kefir from 'kefir';
import kefirBus from 'kefir-bus';

type Props = {
  expanded: boolean;
  onChangeEnd?: ?() => void;
  heightTransition: string;
};
type State = {
  hasExpandedBefore: boolean;
  fullyClosed: boolean;
  height: string;
};
type DefaultProps = {
  heightTransition: string;
};

export default class SmoothCollapse extends React.Component {
  _resetter: Object = kefirBus();
  props: Props;
  state: State;
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onChangeEnd: PropTypes.func,
    heightTransition: PropTypes.string,
    className: PropTypes.string,
    innerClassName: PropTypes.string,
  };
  static defaultProps: DefaultProps = {
    heightTransition: '.25s ease'
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasExpandedBefore: props.expanded,
      fullyClosed: !props.expanded,
      height: props.expanded ? 'auto' : '0px'
    };
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
        hasExpandedBefore: true
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
          height: '0px'
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
    }
  }

  render() {
    const {height, fullyClosed, hasExpandedBefore} = this.state;
    const innerEl = hasExpandedBefore ?
      <div ref="inner" style={{overflow: 'hidden'}} className={this.props.innerClassName}>
        { (this.props:any).children }
      </div>
      : null;

    return (
      <div
        ref="main"
        style={{
          height, overflow: 'hidden',
          display: fullyClosed ? 'none': null,
          transition: `height ${this.props.heightTransition}`
        }}
        className={this.props.className}
        >
        {innerEl}
      </div>
    );
  }
}
