import React, { useLayoutEffect } from 'react';
import styles from './ScssModule.module.scss';

export function ScssModuleReact() {
    useLayoutEffect(() => {
        const el = document.querySelector('#scss-module-react');
        const style = window.getComputedStyle(el);
        console.log(`style: ${style.borderColor}`);
    });

    return (
        <div id="scss-module-react" className={styles.wrapper}>
            This will have a green border
        </div>
    );
}
