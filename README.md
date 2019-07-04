# react-smooth-collapse

[![Circle CI](https://circleci.com/gh/StreakYC/react-smooth-collapse.svg?style=shield)](https://circleci.com/gh/StreakYC/react-smooth-collapse)
[![npm version](https://badge.fury.io/js/react-smooth-collapse.svg)](https://badge.fury.io/js/react-smooth-collapse)

This component lets you animate the height of an element to reveal or hide its
contents. The animation automatically adjusts to the natural height of the
contents.

![Example](https://streakyc.github.io/react-smooth-collapse/video/showhide.gif)

An example can be tried here:

https://streakyc.github.io/react-smooth-collapse/example/

You can find its code in the `example` directory. The example may be compiled
by running:

```
yarn
yarn example-build
# or use this to auto-rebuild on changes:
yarn example-watch
```

**Q:** Why would I use this when I could set a transition rule for height on an
element, and then change the height from "auto" to "0"?

**A:** You can't animate from "auto". This component has the height set to
"auto" while the element is expanded, and when the element is set to collapse,
the element's height is set to equal its current height, and then set to "0" so
that it animates shrinking correctly.

**Q:** Couldn't I animate shrinking by setting a transition rule for
max-height, setting max-height to a very large value when the element is
expanded, and then set max-height to "0" when the element is collapsed?

**A:** That won't animate with the given duration and won't fully respect your
timing function. For example, if you have an element that currently has a
height of 100px, a max-height of 10000px, and a transition rule of "max-height
1s linear", then it will take 0.99 seconds before the element appears to start
shrinking, and then it will fully shrink in 0.01 seconds. If you use a timing
function like "ease" instead of "linear", then the easing will only be apparent
while the element finishes shrinking to 0 or begins expanding from 0.

## SmoothCollapse

This module exports the `SmoothCollapse` React component. The children of the
component should be the contents you want to show or hide. The component also
takes the following props:

* `expanded` must be a boolean controlling whether to show the children.
* `onChangeEnd` may be a function which will be called whenever a show or hide
 animation is completed.
* `collapsedHeight` is the CSS height that the contents should have when
 collapsed. Defaults to "0".
* `heightTransition` may be a string and is used for customizing the animation.
 This value is prefixed with "height " and is set as the CSS transition
 property of the SmoothCollapse element. This property defaults to ".25s ease".
* `allowOverflowWhenOpen` is an optional boolean that when true causes the
 overflow:hidden  CSS rule to be removed while the element is open. This
 behavior is off by  default because the CSS rule must be present while
 animating, and contents that rely on the rule not being present while open may
 be jarringly effected when the rule is added. You may want this prop turned on
 if the children contains a dropdown element which is meant to visually escape
 its container.
 * `eagerRender` will ensure that all children are always rendered, even if they
 have never been expanded. This property defaults to false.

Additional props such as `className` will be passed on to the outer element. Care
should be taken if any rules added by the class name conflict with
SmoothCollapse's own CSS properties.

If the SmoothCollapse component starts out with expanded set to false, eagerRender
is set to false, and collapsedHeight is 0, then the children are not rendered until
the first time the component is expanded. After the component has been expanded
once, the children stay rendered so that they don't lose their state when they're
hidden.

## Types

Both [TypeScript](https://www.typescriptlang.org/) and
[Flow](https://flowtype.org/) type definitions for this module are included!
The type definitions won't require any configuration to use.
