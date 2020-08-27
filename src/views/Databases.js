import React, { useState } from 'react'
import {
  majorScale,
  minorScale,
  Button,
  Heading,
  Pane,
  Spinner,
  Text, Dialog
} from 'evergreen-ui'

import { useStateValue, actions } from '../state'

import { getAllDatabases, addDatabase, removeDatabase, createDatabase } from '../database'

import ProgramList from '../components/DatabaseList'
import CreateDialog from '../components/CreateDialog'
import QrReader from 'react-qr-reader'

function DatabasesView () {
  const [appState, dispatch] = useStateValue()
  const [scannerOpen, setScannerOpen] = useState(false);

  async function fetchDatabases () {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    const programs = await getAllDatabases()
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
    return programs
  }

  const handleCreateDatabase = () => {
    dispatch({ type: actions.DB.OPEN_CREATEDB_DIALOG })
  }

  const createDB = (args) => {
    console.log("Create database...", args)
    createDatabase(args.name, args.type, args.permissions).then((hash) => {
      console.log("Created", hash)
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    })
  }

  const handleScanSuccess = data => {
    if(data) {
      console.log('scan result is', data);
      const [,orbitDbPrefix, ipfsAddress, dbName] = data.split('/');
      if(orbitDbPrefix !== 'orbitdb' || ipfsAddress === undefined || dbName === undefined)
        return;
      addDB(data);
      setScannerOpen(false);
    }

  }
  const handleScanError = err => {
    console.error(err)
  }

  const addDB = (ipfsAddressData) => {
    console.log("Add database...", ipfsAddressData)
    if(appState.programs.some((program)=> {
      return program?.payload?.value?.address === ipfsAddressData;
    })) {
      return console.log('duplicate ipfs address, not add');
    }
    addDatabase(ipfsAddressData).then((hash) => {
      console.log("Added", ipfsAddressData)
      console.log("data hash is", hash)
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    })
  }

  const handleRemoveDatabase = (hash, program) => {
    console.log("Remove database...", hash, program)
    removeDatabase(hash).then(() => {
      console.log("Removed")
      fetchDatabases().then((data) => {
        console.log("Loaded programs", data)
      })
    })
  }

  return (
    <>
    <Pane marginX={majorScale(6)}>
      <Heading
        fontFamily='Titillium Web'
        color='#425A70'
        size={700}
        textTransform='uppercase'
        marginTop={majorScale(3)}
        marginBottom={majorScale(2)}
      >
        Identities
      </Heading>
    </Pane>
    <Pane
      display='flex'
      flexDirection='row'
      marginX={majorScale(6)}
      marginTop={majorScale(2)}
      marginBottom={majorScale(1)}
    >
      <Button
        iconBefore='plus'
        appearance='default'
        height={24}
        marginLeft={minorScale(1)}
        onClick={()=>setScannerOpen(true)}
      >
        Add via QR
      </Button>
      <Button
        iconBefore='document'
        appearance='default'
        height={24}
        onClick={handleCreateDatabase}
      >
        Create Test DB
      </Button>
    </Pane>
    <Pane display='flex' justifyContent='center' overflow='auto'>
      <CreateDialog onCreate={createDB}/>
      <Pane
        flex='1'
        overflow='auto'
        elevation={1}
        background='white'
        marginX={majorScale(6)}
      >
        {!appState.loading.programs
          ? (<ProgramList
              programs={appState.programs}
              onRemove={handleRemoveDatabase}
            />)
          : (<Pane
              display='flex'
              flexDirection='column'
              alignItems='center'
              marginTop={majorScale(3)}
              marginBottom={majorScale(1)}
            >
              <Spinner size={24}/>
              <Text marginY={majorScale(1)}>Loading...</Text>
            </Pane>)
        }
      </Pane>
      <Dialog
        isShown={scannerOpen}
        title="Dialog title"
        onCloseComplete={() => {setScannerOpen(false)}}
        confirmLabel="Custom Label"
      >
        <QrReader
          delay={300}
          onError={handleScanError}
          onScan={handleScanSuccess}
          style={{ width: '80%' }}
        />
        <p>Please scan the identity IPFS address QR from Litentry Authenticator</p>
      </Dialog>
    </Pane>
    </>
  )
}

export default DatabasesView
