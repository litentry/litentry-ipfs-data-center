import React from 'react'
import { majorScale, Heading, Pane, Spinner } from 'evergreen-ui'
import { useLocation, Redirect } from 'react-router-dom'
import { useStateValue, loadingState } from '../state'

import ProgramList from '../components/DatabaseList'

function useQuery () {
  return new URLSearchParams(useLocation().search)
}

function SearchResultsView () {
  const [appState] = useStateValue()

  const query = useQuery().get('q')
  const queryOk = query.length >= 2

  if (!queryOk) return <Redirect to='/' />

  return (
    <Pane display='flex' justifyContent='center'>
      <Pane
        flex='1'
        elevation={1}
        background='white'
        margin={majorScale(6)}
        padding={majorScale(4)}
      >
        <Pane borderBottom='default'>
          <Heading size={600} marginBottom={majorScale(1)}>
            {appState.programs.length} programs found
          </Heading>
        </Pane>
        {appState.programs !== loadingState ? <ProgramList programs={appState.programs} /> : <Spinner marginX='auto' marginY={120} />}
      </Pane>
    </Pane>
  )
}

export default SearchResultsView
