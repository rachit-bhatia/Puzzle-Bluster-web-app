import React from 'react';
import { ReactElement, useState } from 'react';

const DisplayBoard = ({ boardGrid }): ReactElement => {

    return (
        <div className="boardGrid">

            {boardGrid.map((boardRow) => (
                <div className="boardRow">

                    {boardRow.map((wordContent) => (
                        <button className="boardCell">
                            {wordContent}
                        </button>
                    ))}

                </div>
        ))}
        </div>
    )
}

export default DisplayBoard;
