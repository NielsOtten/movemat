import React from 'react';
import styles from './styles.scss';

const Box = ({ children }) => (
  <div className={styles.box}>
    <div className={styles.wrapper}>
      { children }
    </div>
  </div>
);

export default Box;
