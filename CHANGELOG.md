## 1.6.0 (2018-09-24)

* Added eagerRender prop [#19](https://github.com/StreakYC/react-smooth-collapse/pull/19)

## 1.5.0 (2018-02-19)

* Added allowOverflowWhenOpen prop [#10](https://github.com/StreakYC/react-smooth-collapse/issues/10)

## 1.4.0 (2018-02-19)

* Added className prop [#9](https://github.com/StreakYC/react-smooth-collapse/pull/9)

## 1.3.2 (2017-10-04)

* Minor optimization to internal ref handling.
* Changed the package's peerDependencies to mark compatibility with React v16.

## 1.3.0 (2017-08-23)

* Add support for [Flow](https://flow.org/) 0.53.

## 1.2.0 (2017-04-25)

* Breaking change: React ^0.14.9 or ^15.3.0 is now required. (The new version of React is backwards compatible as its change was only a minor version bump, so I didn't consider this a change worthy of a major version bump in this package, but arguably this was a semver violation on my part.)
* Use the new React [prop-types package](https://reactjs.org/docs/typechecking-with-proptypes.html).

## 1.1.1 (2017-03-28)

* Fixed rare issue that could cause onChangeEnd to not be fired when it should have been.

## 1.1.0 (2016-08-17)

* Added collapsedHeight prop [#3](https://github.com/StreakYC/react-smooth-collapse/issues/3)

## 1.0.3 (2016-04-07)

* Changed the package's peerDependencies to mark compatibility with React v15.

## 1.0.2 (2016-03-10)

* Fixed issue causing the height animation to be jumpy when the inner element has
  a margin.

## 1.0.1 (2016-03-10)

* Apply display:none to the inner element when SmoothCollapse is collapsed.
  Prevents the hidden elements from becoming focused.

## 1.0.0 (2016-02-26)

Initial stable release.
