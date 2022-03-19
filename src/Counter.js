import React from 'react';

export function Counter(props) {
    return (
        <div>
            <span style={{ fontSize: "13px", }}>{props.count} / 50</span>
        </div>
    )
}

export default Counter
