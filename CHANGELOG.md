## 2.1.2 (2022-08-28)

* Added React v18 to peerDependencies. This library wasn't affected by any React changes and works without warnings even in Strict Mode.

## 2.1.1 (2022-01-22)

* Added React v17 to peerDependencies.

## 2.1.0 (2019-07-30)

* Pass any unrecognized props on to the outer div element [#23](https://github.com/StreakYC/react-smooth-collapse/pull/23)

## 2.0.1 (2019-03-12)

* Removed dependency on Kefir (10KB minified and gzipped).

## 2.0.0 (2018-09-24)

### Breaking Changes
* Now requires React ^16.3.0.
* The module now exports the SmoothCollapse component as the default export. If you use SmoothCollapse by using `import SmoothCollapse from 'react-smooth-collapse';` with Babel or TypeScript, then you don't need to change anything, but if you use `require('react-smooth-collapse')`, then you'll need to change your code to use import or to use `require('react-smooth-collapse').default`.

### Improvements
* No longer uses deprecated React methods.
* Added TypeScript type definitions.

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

* Added support for [Flow](https://flow.org/) 0.53.

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
