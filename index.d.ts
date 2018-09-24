import * as React from 'react';

export interface Props {
  expanded: boolean;
  onChangeEnd?: (() => void) | null | undefined;
  collapsedHeight?: string;
  heightTransition?: string;
  className?: string;
  allowOverflowWhenOpen?: boolean;
  eagerRender?: boolean;
}

export default class SmoothCollapse extends React.Component<Props> {
}
