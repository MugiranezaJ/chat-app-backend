import events from '../utils/events'
import { addUsers, deleteUser } from '../utils/tools'

let users = {}
let count = 1
export const socketIOController = io => socket =>{
    const { name, room } =socket.handshake.query
    console.log('client connected: ['+ count++ +']' + socket.id)
    // console.log("Name: " + name, "Room: " + room)
    socket.join(room)

    socket.on( events.NEW_USER, user => {
        console.log("SOCK: " + socket.id)
        users = addUsers( users, user )
        socket.user = user
        io.emit( events.NEW_USER, { newUsers: users })
    })


    setInterval(() =>{
        socket.emit('time', { roomId: room, serverTime: new Date()})
    }, 5000)

    socket.on( 'disconnect', (reason) => {
        console.log("Reason: " + reason)
        if( socket.user ){
            users = deleteUser( users, socket.user.username )
            io.emit( events.LOGOUT, { newUsers: users, outUser: socket.user.username} )
        }
    })
}