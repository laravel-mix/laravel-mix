import React from 'react';
import style from './sperateFile.module.css';

export function componentCssImportReact() {
    return (
        <div id="component" className={style.component}>
            This will have a red border
        </div>
    );
}
