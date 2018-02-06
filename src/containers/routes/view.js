import React from 'react'
import {connect} from 'react-redux'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import App from '../app'
import {view as Admin} from '../../components/admin'
import {view as Articles} from '../../components/articles'
import {view as Products} from '../../components/products'
import {view as NotFound} from '../../components/notFound'
import {actions as headerActions} from '../../components/header'
import {updateRoute} from './actions'

const Routes = ({routeDidUpdate}) => (
  <Router history={browserHistory} onUpdate={routeDidUpdate}>
    <Route path="/" component={App}>
      <IndexRoute component={Articles} />
      <Route path="admin" component={Admin} />
      <Route path="articles" component={Articles} />
      <Route path="products" component={Products} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
)

const mapDispatch = (dispatch) => ({
  routeDidUpdate: () => {
    dispatch(headerActions.toggleDrawer(false))
    dispatch(updateRoute())
  }
})

export default connect(null, mapDispatch)(Routes)
