import React from 'react'
import NavigationItem from './NavigationItem/NavigationItem'
import classes from './NavigationItems.css'

const NavigationItems = () => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/">Burger Builder</NavigationItem>
    <NavigationItem link="/Orders">Orders</NavigationItem>
    <NavigationItem link="/Auth">Authenticate</NavigationItem>
  </ul>
)

export default NavigationItems
