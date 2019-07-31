import * as React from 'react';

export interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  expanded: boolean;
  onChangeEnd?: (() => void) | null | undefined;
  collapsedHeight?: string;
  heightTransition?: string;
  allowOverflowWhenOpen?: boolean;
  eagerRender?: boolean;
}

export default class SmoothCollapse extends React.Component<Props> {
}
