import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

export const TerminalIllustration = () => (
  <Svg width={110} height={100} viewBox="0 0 110 100">
    <Ellipse cx={55} cy={82} rx={32} ry={6} fill="rgba(37, 99, 235, 0.1)" />
    <Path d="M 42 62 L 68 62 L 62 80 L 48 80 Z" fill="#cbd5e1" />
    <Path d="M 42 62 L 48 80 L 45 80 L 39 62 Z" fill="#94a3b8" />
    <Path d="M 36 38 L 74 38 L 70 65 L 40 65 Z" fill="#1e293b" />
    <Path d="M 68 25 L 82 25 L 78 40 L 64 40 Z" fill="#0f172a" />
    <Path d="M 69 12 C 69 12, 70 8, 73 8 H 83 C 86 8, 87 12, 87 12 V 25 H 69 Z" fill="#ffffff" />
    <Path d="M 72 15 H 84" stroke="#e2e8f0" strokeWidth={1} />
    <Path d="M 72 19 H 80" stroke="#e2e8f0" strokeWidth={1} />
    <Path d="M 28 32 C 28 30, 30 28, 33 28 H 77 C 80 28, 82 30, 82 32 V 62 C 82 64, 80 66, 77 66 H 33 C 30 66, 28 64, 28 62 Z" fill="#2563eb" />
    <Path d="M 31 34 H 79 V 60 H 31 Z" fill="#0f172a" />
    <Path d="M 33 36 H 77 V 57 H 33 Z" fill="#eff6ff" />
    <Circle cx={55} cy={46} r={6} fill="#dbeafe" />
    <Path d="M 52 43 H 53.5 L 55 47.5 H 58.5 L 59.5 45" stroke="#2563eb" strokeWidth={1} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx={55} cy={49.5} r={0.8} fill="#2563eb" />
    <Circle cx={57.5} cy={49.5} r={0.8} fill="#2563eb" />
    <Path d="M 18 20 L 23 24" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M 14 31 H 21" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" />
    <Path d="M 18 42 L 23 38" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" />
  </Svg>
);
