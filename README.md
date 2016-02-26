# react-smooth-collapse

[![Circle CI](https://circleci.com/gh/StreakYC/react-smooth-collapse.svg?style=shield)](https://circleci.com/gh/StreakYC/react-smooth-collapse)
[![npm version](https://badge.fury.io/js/react-smooth-collapse.svg)](https://badge.fury.io/js/react-smooth-collapse)

This component lets animate the height of an element to reveal or hide its
contents. The animation automatically aligns with the natural height of the
contents.

[TODO put a gif here]

An example can be tried here:

https://streakyc.github.io/react-smooth-collapse/example/

You can find its code in the `example` directory. The example may be compiled
by running:

```
npm install
npm run example-build
```

You can build the example with live editing enabled (using
[react-transform-hmr](https://github.com/gaearon/react-transform-hmr) and
[browserify-hmr](https://github.com/AgentME/browserify-hmr)) by running:

```
npm run example-watch
```

## SmoothCollapse

This module exports the `SmoothCollapse` React component. The children of the
component should be the contents you want to show or hide. The component also
takes the following props:

* `expanded` must be a boolean controlling whether to show the children.
* `onChangeEnd` may be a function which will be called whenever a show or hide
 animation is completed.
* `heightTransition` may be a string and is used for customizing the animation.
 This value is prefixed with "height " and is set as the CSS transition
 property of the SmoothCollapse element. This property defaults to ".25s ease".

If the SmoothCollapse component starts out with expanded set to false, then the
children are not rendered until the first time the component is expanded. After
the component has been expanded once, the children stay rendered so that they
don't lose their state when they're hidden.

## Types

[Flow Type](http://flowtype.org/) declarations for this module are included! As
of Flow v0.22, you must add the following entries to your `.flowconfig` file's
options section for them to work:

```
[options]
esproposal.class_static_fields=enable
esproposal.class_instance_fields=enable
```
