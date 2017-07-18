/* @flow */

export default function getTransitionTimeMs(heightTransition: string): number {
  const m = /(\d+(?:\.\d+)?|\.\d+)(m?s)\b/i.exec(heightTransition);
  if (!m) throw new Error('Could not parse time from transition value');
  return Number(m[1]) * (m[2].length === 1 ? 1000 : 1);
}
