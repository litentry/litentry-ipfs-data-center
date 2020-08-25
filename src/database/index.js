import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'
import Config from '../config'

// OrbitDB instance
let orbitdb

// Databases
let programs

// Start IPFS
export const initIPFS = async () => {
  return await IPFS.create(Config.ipfs)
}

// Start OrbitDB
export const initOrbitDB = async (ipfs) => {
  orbitdb = await OrbitDB.createInstance(ipfs)
  console.log('generated identity is', orbitdb.identity);
  return orbitdb
}

export const getAllDatabases = async () => {
  if (!programs && orbitdb) {
    // Load programs database
    programs = await orbitdb.feed('litentry', {
      accessController: { write: [orbitdb.identity.id] },
      create: true
    })
    await programs.load()
  }

  return programs
    ? programs.iterator({ limit: -1 }).collect()
    : []
}

export const getDB = async (address) => {
  let db
  if (orbitdb) {
    db = await orbitdb.open(address)
    await db.load()
  }
  return db
}

export const addDatabase = async (address) => {
  try {
    const db = await orbitdb.open(address)
    return programs.add({
      name: db.dbname,
      type: db.type,
      address: address,
      added: Date.now()
    })
  }catch (e){
    console.log('adding error', e)
  }
}

export const createDatabase = async (name, type, permissions) => {
  let accessController

  switch (permissions) {
    case 'public':
      accessController = { write: ['*'] }
      break
    default:
      accessController = { write: [orbitdb.identity.id] }
      break
  }

  const db = await orbitdb.create(name, type, { accessController })

  return programs.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}

export const removeDatabase = async (hash) => {
  return programs.remove(hash)
}
