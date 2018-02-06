import React from 'react'
import {connect} from 'react-redux'
import {withStyles} from 'material-ui'
import {AppBar, Toolbar, Typography, IconButton} from 'material-ui'
import {green} from 'material-ui/colors'
import MenuIcon from 'material-ui-icons/Menu'
import LightbulbOutlineIcon from 'material-ui-icons/LightbulbOutline'
import TranslateIcon from 'material-ui-icons/Translate'
import {SplitToSpans} from '../../../utils'
import {toggleDrawer} from '../actions'
import {actions as themeActions} from '../../../containers/theme'

import './header.css'

const drawerWidth = 250

const styles = (theme) => ({
  'nav-icon-button': {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  header: {
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  bar: {},
  checked: {
    color: green[500],
    '& + $bar': {
      backgroundColor: green[500],
    },
  },
})

const Header = ({classes, thisToggleDrawer, thisToggleThemeType}) => (
  <AppBar color="primary" className={classes.header}>
    <Toolbar>
      <IconButton color="inherit" className={classes['nav-icon-button']} onClick={thisToggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Typography className="title mono" color="inherit" type="title">
        <SplitToSpans />
      </Typography>
      <IconButton>
        <TranslateIcon />
      </IconButton>
      <IconButton onClick={thisToggleThemeType}>
        <LightbulbOutlineIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
)

const mapDispatch = (dispatch) => ({
  thisToggleDrawer: () => dispatch(toggleDrawer(null)),
  thisToggleThemeType: () => dispatch(themeActions.toggleThemeType()),
})

const HeaderWrap = connect(null, mapDispatch)(Header)

export default withStyles(styles)(HeaderWrap)
