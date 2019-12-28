import React from 'react'
import {
  majorScale,
  Button,
  Heading,
  Pane,
  TextInput
} from 'evergreen-ui'

import { useStateValue, actions } from '../state'

function EventLogControls () {
  const [appState, dispatch] = useStateValue()
  const [value, setValue] = React.useState('')

  function handleValueChange (event) {
    setValue(event.target.value)
  }

  function handleAdd (event) {
    if (event) event.preventDefault()
    if (value.length === 0) return
    addToDB()
  }

  const addToDB = async () => {
    const db = appState.db

    if (db.type !== 'eventlog' && db.type !== 'feed') {
      throw new Error('This component can only handle Log and Feed databases')
    }

    await db.add(value)

    const entries = await db.iterator({ limit: 10 }).collect().reverse()
    dispatch({ type: actions.DB.SET_DB, db, entries })
  }

  return (
    <Pane
      flex='1'
    >
      <Heading marginBottom={majorScale(1)}>Add an event to the log database</Heading>
      <TextInput
        onChange={handleValueChange}
        name='value'
        placeholder='Value'
        height={24}
        width='30%'
      ></TextInput>
      <Button
        iconBefore='plus'
        appearance='default'
        height={24}
        marginLeft={majorScale(1)}
        onClick={handleAdd}
      >
        Add
      </Button>
    </Pane>
  )
}

export default EventLogControls
