'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _kefir = require('kefir');

var _kefir2 = _interopRequireDefault(_kefir);

var _kefirBus = require('kefir-bus');

var _kefirBus2 = _interopRequireDefault(_kefirBus);

var _getTransitionTimeMs = require('./getTransitionTimeMs');

var _getTransitionTimeMs2 = _interopRequireDefault(_getTransitionTimeMs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SmoothCollapse = function (_React$Component) {
  (0, _inherits3.default)(SmoothCollapse, _React$Component);

  function SmoothCollapse(props) {
    (0, _classCallCheck3.default)(this, SmoothCollapse);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SmoothCollapse.__proto__ || (0, _getPrototypeOf2.default)(SmoothCollapse)).call(this, props));

    _this._resetter = (0, _kefirBus2.default)();

    _this.state = {
      hasBeenVisibleBefore: props.expanded || _this._visibleWhenClosed(),
      fullyClosed: !props.expanded,
      height: props.expanded ? 'auto' : props.collapsedHeight
    };
    return _this;
  }

  (0, _createClass3.default)(SmoothCollapse, [{
    key: '_visibleWhenClosed',
    value: function _visibleWhenClosed(props) {
      if (!props) props = this.props;
      return parseFloat(props.collapsedHeight) !== 0;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._resetter.emit(null);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (!this.props.expanded && nextProps.expanded) {
        this._resetter.emit(null);

        // In order to expand, we need to know the height of the children, so we
        // need to setState first so they get rendered before we continue.

        this.setState({
          fullyClosed: false,
          hasBeenVisibleBefore: true
        }, function () {
          // Set the collapser to the target height instead of auto so that it
          // animates correctly. Then switch it to 'auto' after the animation so
          // that it flows correctly if the page is resized.
          var targetHeight = _this2.refs.inner.clientHeight + 'px';
          _this2.setState({
            height: targetHeight
          });

          // Wait until the transitionend event, or until a timer goes off in
          // case the event doesn't fire because the browser doesn't support it
          // or the element is hidden before it happens. The timer is a little
          // longer than the transition is supposed to take to make sure we don't
          // cut the animation early while it's still going if the browser is
          // running it just a little slow.
          _kefir2.default.fromEvents(_this2.refs.main, 'transitionend').merge(_kefir2.default.later((0, _getTransitionTimeMs2.default)(nextProps.heightTransition) * 1.1 + 500)).takeUntilBy(_this2._resetter).take(1).onValue(function () {
            _this2.setState({
              height: 'auto'
            }, function () {
              if (_this2.props.onChangeEnd) {
                _this2.props.onChangeEnd();
              }
            });
          });
        });
      } else if (this.props.expanded && !nextProps.expanded) {
        this._resetter.emit(null);

        this.setState({
          height: this.refs.inner.clientHeight + 'px'
        }, function () {
          _this2.refs.main.clientHeight; // force the page layout
          _this2.setState({
            height: nextProps.collapsedHeight
          });

          // See comment above about previous use of transitionend event.
          _kefir2.default.fromEvents(_this2.refs.main, 'transitionend').merge(_kefir2.default.later((0, _getTransitionTimeMs2.default)(nextProps.heightTransition) * 1.1 + 500)).takeUntilBy(_this2._resetter).take(1).onValue(function () {
            _this2.setState({
              fullyClosed: true
            });
            if (_this2.props.onChangeEnd) {
              _this2.props.onChangeEnd();
            }
          });
        });
      } else if (!nextProps.expanded && this.props.collapsedHeight !== nextProps.collapsedHeight) {
        this.setState({
          hasBeenVisibleBefore: this.state.hasBeenVisibleBefore || this._visibleWhenClosed(nextProps),
          height: nextProps.collapsedHeight
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var visibleWhenClosed = this._visibleWhenClosed();
      var _state = this.state,
          height = _state.height,
          fullyClosed = _state.fullyClosed,
          hasBeenVisibleBefore = _state.hasBeenVisibleBefore;

      var innerEl = hasBeenVisibleBefore ? _react2.default.createElement(
        'div',
        { ref: 'inner', style: { overflow: 'hidden' } },
        this.props.children
      ) : null;

      return _react2.default.createElement(
        'div',
        {
          ref: 'main',
          className: this.props.className,
          style: {
            height: height,
            overflow: 'hidden',
            display: fullyClosed && !visibleWhenClosed ? 'none' : null,
            transition: 'height ' + this.props.heightTransition
          }
        },
        innerEl
      );
    }
  }]);
  return SmoothCollapse;
}(_react2.default.Component);

SmoothCollapse.propTypes = {
  expanded: _propTypes2.default.bool.isRequired,
  onChangeEnd: _propTypes2.default.func,
  collapsedHeight: _propTypes2.default.string,
  heightTransition: _propTypes2.default.string,
  className: _propTypes2.default.string
};
SmoothCollapse.defaultProps = {
  collapsedHeight: '0',
  heightTransition: '.25s ease',
  className: ''
};
exports.default = SmoothCollapse;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJTbW9vdGhDb2xsYXBzZSIsInByb3BzIiwiX3Jlc2V0dGVyIiwic3RhdGUiLCJoYXNCZWVuVmlzaWJsZUJlZm9yZSIsImV4cGFuZGVkIiwiX3Zpc2libGVXaGVuQ2xvc2VkIiwiZnVsbHlDbG9zZWQiLCJoZWlnaHQiLCJjb2xsYXBzZWRIZWlnaHQiLCJwYXJzZUZsb2F0IiwiZW1pdCIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwidGFyZ2V0SGVpZ2h0IiwicmVmcyIsImlubmVyIiwiY2xpZW50SGVpZ2h0IiwiZnJvbUV2ZW50cyIsIm1haW4iLCJtZXJnZSIsImxhdGVyIiwiaGVpZ2h0VHJhbnNpdGlvbiIsInRha2VVbnRpbEJ5IiwidGFrZSIsIm9uVmFsdWUiLCJvbkNoYW5nZUVuZCIsInZpc2libGVXaGVuQ2xvc2VkIiwiaW5uZXJFbCIsIm92ZXJmbG93IiwiY2hpbGRyZW4iLCJjbGFzc05hbWUiLCJkaXNwbGF5IiwidHJhbnNpdGlvbiIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsImJvb2wiLCJpc1JlcXVpcmVkIiwiZnVuYyIsInN0cmluZyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7SUFvQnFCQSxjOzs7QUFpQm5CLDBCQUFZQyxLQUFaLEVBQTBCO0FBQUE7O0FBQUEsc0pBQ2xCQSxLQURrQjs7QUFBQSxVQWhCMUJDLFNBZ0IwQixHQWhCZCx5QkFnQmM7O0FBRXhCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyw0QkFBc0JILE1BQU1JLFFBQU4sSUFBa0IsTUFBS0Msa0JBQUwsRUFEN0I7QUFFWEMsbUJBQWEsQ0FBQ04sTUFBTUksUUFGVDtBQUdYRyxjQUFRUCxNQUFNSSxRQUFOLEdBQWlCLE1BQWpCLEdBQTBCSixNQUFNUTtBQUg3QixLQUFiO0FBRndCO0FBT3pCOzs7O3VDQUVr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QixvQkFBb0IsS0FBS3JCLGtCQUFMLEVBQTFCO0FBRE8sbUJBRStDLEtBQUtILEtBRnBEO0FBQUEsVUFFQ0ssTUFGRCxVQUVDQSxNQUZEO0FBQUEsVUFFU0QsV0FGVCxVQUVTQSxXQUZUO0FBQUEsVUFFc0JILG9CQUZ0QixVQUVzQkEsb0JBRnRCOztBQUdQLFVBQU13QixVQUFVeEIsdUJBQ1o7QUFBQTtBQUFBLFVBQUssS0FBSSxPQUFULEVBQWlCLE9BQU8sRUFBRXlCLFVBQVUsUUFBWixFQUF4QjtBQUNJLGFBQUs1QixLQUFOLENBQWtCNkI7QUFEckIsT0FEWSxHQUlaLElBSko7O0FBTUEsYUFDRTtBQUFBO0FBQUE7QUFDRSxlQUFJLE1BRE47QUFFRSxxQkFBVyxLQUFLN0IsS0FBTCxDQUFXOEIsU0FGeEI7QUFHRSxpQkFBTztBQUNMdkIsMEJBREs7QUFFTHFCLHNCQUFVLFFBRkw7QUFHTEcscUJBQVN6QixlQUFlLENBQUNvQixpQkFBaEIsR0FBb0MsTUFBcEMsR0FBNkMsSUFIakQ7QUFJTE0sb0NBQXNCLEtBQUtoQyxLQUFMLENBQVdxQjtBQUo1QjtBQUhUO0FBVUdNO0FBVkgsT0FERjtBQWNEOzs7RUEzSXlDLGdCQUFNTSxTOztBQUE3QmxDLGMsQ0FJWm1DLFMsR0FBWTtBQUNqQjlCLFlBQVUsb0JBQVUrQixJQUFWLENBQWVDLFVBRFI7QUFFakJYLGVBQWEsb0JBQVVZLElBRk47QUFHakI3QixtQkFBaUIsb0JBQVU4QixNQUhWO0FBSWpCakIsb0JBQWtCLG9CQUFVaUIsTUFKWDtBQUtqQlIsYUFBVyxvQkFBVVE7QUFMSixDO0FBSkF2QyxjLENBV1p3QyxZLEdBQTZCO0FBQ2xDL0IsbUJBQWlCLEdBRGlCO0FBRWxDYSxvQkFBa0IsV0FGZ0I7QUFHbENTLGFBQVc7QUFIdUIsQztrQkFYakIvQixjIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgS2VmaXIgZnJvbSAna2VmaXInO1xuaW1wb3J0IGtlZmlyQnVzIGZyb20gJ2tlZmlyLWJ1cyc7XG5cbmltcG9ydCBnZXRUcmFuc2l0aW9uVGltZU1zIGZyb20gJy4vZ2V0VHJhbnNpdGlvblRpbWVNcyc7XG5cbmV4cG9ydCB0eXBlIFByb3BzID0ge1xuICBleHBhbmRlZDogYm9vbGVhbixcbiAgb25DaGFuZ2VFbmQ/OiA/KCkgPT4gdm9pZCxcbiAgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmcsXG4gIGhlaWdodFRyYW5zaXRpb246IHN0cmluZyxcbiAgY2xhc3NOYW1lOiBzdHJpbmcsXG59O1xudHlwZSBTdGF0ZSA9IHtcbiAgaGFzQmVlblZpc2libGVCZWZvcmU6IGJvb2xlYW4sXG4gIGZ1bGx5Q2xvc2VkOiBib29sZWFuLFxuICBoZWlnaHQ6IHN0cmluZyxcbn07XG50eXBlIERlZmF1bHRQcm9wcyA9IHtcbiAgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmcsXG4gIGhlaWdodFRyYW5zaXRpb246IHN0cmluZyxcbiAgY2xhc3NOYW1lOiBzdHJpbmcsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbW9vdGhDb2xsYXBzZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIF9yZXNldHRlciA9IGtlZmlyQnVzKCk7XG4gIHByb3BzOiBQcm9wcztcbiAgc3RhdGU6IFN0YXRlO1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGV4cGFuZGVkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIG9uQ2hhbmdlRW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBjb2xsYXBzZWRIZWlnaHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgaGVpZ2h0VHJhbnNpdGlvbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIH07XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHM6IERlZmF1bHRQcm9wcyA9IHtcbiAgICBjb2xsYXBzZWRIZWlnaHQ6ICcwJyxcbiAgICBoZWlnaHRUcmFuc2l0aW9uOiAnLjI1cyBlYXNlJyxcbiAgICBjbGFzc05hbWU6ICcnLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaGFzQmVlblZpc2libGVCZWZvcmU6IHByb3BzLmV4cGFuZGVkIHx8IHRoaXMuX3Zpc2libGVXaGVuQ2xvc2VkKCksXG4gICAgICBmdWxseUNsb3NlZDogIXByb3BzLmV4cGFuZGVkLFxuICAgICAgaGVpZ2h0OiBwcm9wcy5leHBhbmRlZCA/ICdhdXRvJyA6IHByb3BzLmNvbGxhcHNlZEhlaWdodCxcbiAgICB9O1xuICB9XG5cbiAgX3Zpc2libGVXaGVuQ2xvc2VkKHByb3BzOiA/UHJvcHMpIHtcbiAgICBpZiAoIXByb3BzKSBwcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQocHJvcHMuY29sbGFwc2VkSGVpZ2h0KSAhPT0gMDtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX3Jlc2V0dGVyLmVtaXQobnVsbCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogUHJvcHMpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuZXhwYW5kZWQgJiYgbmV4dFByb3BzLmV4cGFuZGVkKSB7XG4gICAgICB0aGlzLl9yZXNldHRlci5lbWl0KG51bGwpO1xuXG4gICAgICAvLyBJbiBvcmRlciB0byBleHBhbmQsIHdlIG5lZWQgdG8ga25vdyB0aGUgaGVpZ2h0IG9mIHRoZSBjaGlsZHJlbiwgc28gd2VcbiAgICAgIC8vIG5lZWQgdG8gc2V0U3RhdGUgZmlyc3Qgc28gdGhleSBnZXQgcmVuZGVyZWQgYmVmb3JlIHdlIGNvbnRpbnVlLlxuXG4gICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICB7XG4gICAgICAgICAgZnVsbHlDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgIGhhc0JlZW5WaXNpYmxlQmVmb3JlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgLy8gU2V0IHRoZSBjb2xsYXBzZXIgdG8gdGhlIHRhcmdldCBoZWlnaHQgaW5zdGVhZCBvZiBhdXRvIHNvIHRoYXQgaXRcbiAgICAgICAgICAvLyBhbmltYXRlcyBjb3JyZWN0bHkuIFRoZW4gc3dpdGNoIGl0IHRvICdhdXRvJyBhZnRlciB0aGUgYW5pbWF0aW9uIHNvXG4gICAgICAgICAgLy8gdGhhdCBpdCBmbG93cyBjb3JyZWN0bHkgaWYgdGhlIHBhZ2UgaXMgcmVzaXplZC5cbiAgICAgICAgICBjb25zdCB0YXJnZXRIZWlnaHQgPSBgJHt0aGlzLnJlZnMuaW5uZXIuY2xpZW50SGVpZ2h0fXB4YDtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGhlaWdodDogdGFyZ2V0SGVpZ2h0LFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgdHJhbnNpdGlvbmVuZCBldmVudCwgb3IgdW50aWwgYSB0aW1lciBnb2VzIG9mZiBpblxuICAgICAgICAgIC8vIGNhc2UgdGhlIGV2ZW50IGRvZXNuJ3QgZmlyZSBiZWNhdXNlIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBpdFxuICAgICAgICAgIC8vIG9yIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBiZWZvcmUgaXQgaGFwcGVucy4gVGhlIHRpbWVyIGlzIGEgbGl0dGxlXG4gICAgICAgICAgLy8gbG9uZ2VyIHRoYW4gdGhlIHRyYW5zaXRpb24gaXMgc3VwcG9zZWQgdG8gdGFrZSB0byBtYWtlIHN1cmUgd2UgZG9uJ3RcbiAgICAgICAgICAvLyBjdXQgdGhlIGFuaW1hdGlvbiBlYXJseSB3aGlsZSBpdCdzIHN0aWxsIGdvaW5nIGlmIHRoZSBicm93c2VyIGlzXG4gICAgICAgICAgLy8gcnVubmluZyBpdCBqdXN0IGEgbGl0dGxlIHNsb3cuXG4gICAgICAgICAgS2VmaXIuZnJvbUV2ZW50cyh0aGlzLnJlZnMubWFpbiwgJ3RyYW5zaXRpb25lbmQnKVxuICAgICAgICAgICAgLm1lcmdlKEtlZmlyLmxhdGVyKGdldFRyYW5zaXRpb25UaW1lTXMobmV4dFByb3BzLmhlaWdodFRyYW5zaXRpb24pICogMS4xICsgNTAwKSlcbiAgICAgICAgICAgIC50YWtlVW50aWxCeSh0aGlzLl9yZXNldHRlcilcbiAgICAgICAgICAgIC50YWtlKDEpXG4gICAgICAgICAgICAub25WYWx1ZSgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnYXV0bycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZUVuZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlRW5kKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmV4cGFuZGVkICYmICFuZXh0UHJvcHMuZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuX3Jlc2V0dGVyLmVtaXQobnVsbCk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICBoZWlnaHQ6IGAke3RoaXMucmVmcy5pbm5lci5jbGllbnRIZWlnaHR9cHhgLFxuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZWZzLm1haW4uY2xpZW50SGVpZ2h0OyAvLyBmb3JjZSB0aGUgcGFnZSBsYXlvdXRcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGhlaWdodDogbmV4dFByb3BzLmNvbGxhcHNlZEhlaWdodCxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFNlZSBjb21tZW50IGFib3ZlIGFib3V0IHByZXZpb3VzIHVzZSBvZiB0cmFuc2l0aW9uZW5kIGV2ZW50LlxuICAgICAgICAgIEtlZmlyLmZyb21FdmVudHModGhpcy5yZWZzLm1haW4sICd0cmFuc2l0aW9uZW5kJylcbiAgICAgICAgICAgIC5tZXJnZShLZWZpci5sYXRlcihnZXRUcmFuc2l0aW9uVGltZU1zKG5leHRQcm9wcy5oZWlnaHRUcmFuc2l0aW9uKSAqIDEuMSArIDUwMCkpXG4gICAgICAgICAgICAudGFrZVVudGlsQnkodGhpcy5fcmVzZXR0ZXIpXG4gICAgICAgICAgICAudGFrZSgxKVxuICAgICAgICAgICAgLm9uVmFsdWUoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBmdWxseUNsb3NlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlRW5kKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZUVuZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKCFuZXh0UHJvcHMuZXhwYW5kZWQgJiYgdGhpcy5wcm9wcy5jb2xsYXBzZWRIZWlnaHQgIT09IG5leHRQcm9wcy5jb2xsYXBzZWRIZWlnaHQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBoYXNCZWVuVmlzaWJsZUJlZm9yZTogdGhpcy5zdGF0ZS5oYXNCZWVuVmlzaWJsZUJlZm9yZSB8fCB0aGlzLl92aXNpYmxlV2hlbkNsb3NlZChuZXh0UHJvcHMpLFxuICAgICAgICBoZWlnaHQ6IG5leHRQcm9wcy5jb2xsYXBzZWRIZWlnaHQsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgdmlzaWJsZVdoZW5DbG9zZWQgPSB0aGlzLl92aXNpYmxlV2hlbkNsb3NlZCgpO1xuICAgIGNvbnN0IHsgaGVpZ2h0LCBmdWxseUNsb3NlZCwgaGFzQmVlblZpc2libGVCZWZvcmUgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgaW5uZXJFbCA9IGhhc0JlZW5WaXNpYmxlQmVmb3JlXG4gICAgICA/IDxkaXYgcmVmPVwiaW5uZXJcIiBzdHlsZT17eyBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICAgICAgeyh0aGlzLnByb3BzOiBhbnkpLmNoaWxkcmVufVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDogbnVsbDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj1cIm1haW5cIlxuICAgICAgICBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgZGlzcGxheTogZnVsbHlDbG9zZWQgJiYgIXZpc2libGVXaGVuQ2xvc2VkID8gJ25vbmUnIDogbnVsbCxcbiAgICAgICAgICB0cmFuc2l0aW9uOiBgaGVpZ2h0ICR7dGhpcy5wcm9wcy5oZWlnaHRUcmFuc2l0aW9ufWAsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtpbm5lckVsfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19