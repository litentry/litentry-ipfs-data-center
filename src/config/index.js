const config = {
  ipfs: {
    preload: {
      enabled: false
    },
    EXPERIMENTAL: {
      pubsub: true // required, enables pubsub
    },
    config: {
      Addresses: {
        Swarm: [
          // '/dns4/damp-lake-31712.herokuapp.com/tcp/443/wss/p2p-webrtc-star/'
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
        ]
      }
    }
  }
}

export default config
