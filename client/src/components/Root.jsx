const logoPath = require('../../img/noaa_logo_circle_72x72.svg')

import React from 'react'
import SearchContainer from '../search/SearchContainer'
import LandingContainer from '../search/LandingContainer'
//import FacetContainer from '../facet/FacetContainer'
import Favicon from 'react-favicon'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import styles from './root.css'


const Root = ({children, routes}) => {
    return <div>
      <Favicon url={["http://www.noaa.gov/sites/all/themes/custom/noaa/favicon.ico"]}/>
      <div className={styles.bottomBorder}>
          <div className={`${styles.appbar} ${styles.panel}`} id='appbar' rounded={false}>
            <div className={styles.logoBox}>
                <img className={styles.logo} id='logo' src={logoPath} alt="NOAA Logo"/>
                <div className={styles.orgBox}>
                    <a className={styles.orgName} href="/">National Oceanic and Atmospheric Administration</a>
                    <a className={styles.deptName} href="http://www.commerce.gov">U.S. Department of Commerce</a>
                </div>
            </div>
            <div className={styles.searchFacet} id='search-facet'>
              <SearchContainer/>
            </div>
          </div>
      </div>
      <div>
      {children}
      </div>
      <div className={styles.footer} id='footer'>
        <Footer/>
      </div>
    </div>
}

export default Root
