import React from 'react';

import styles from './Footer.module.css'

const Footer: React.FC = () => {
    return (
        <div className={styles.footerWrapper}>
            <div className={styles.footer}>
                <div className="copyright">
                    <span>
                        ©2022 <a href="https://helixmetaverse.com/">HELIX</a> All Rights Reserved
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Footer;
