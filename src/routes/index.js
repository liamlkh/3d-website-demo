import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import history from './history'

import Home from '@/pages/Home'

const Routes = () => {
  return (
    <ConnectedRouter history={history} >
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </ConnectedRouter>
  )
}

export default Routes
