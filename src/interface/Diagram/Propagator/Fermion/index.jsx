// external imports
import React from 'react'
// local imports
import styles from './styles'
import Arrow from './Arrow'

const Fermion = ({ x1, y1, x2, y2, stroke, anchor1, anchor2, strokeWidth, selected, ...unusedProps }) => (
    <g>
        <path
            {...styles.container}
            {...unusedProps}
            stroke={stroke}
            strokeWidth={strokeWidth}
            d={`M ${x1} ${y1} L ${x2} ${y2}`}
        />
        <Arrow
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={stroke}
            selected={selected}
            strokeWidth={strokeWidth}
        />
    </g>
)

export default Fermion
