import events from '../utils/events'
import { addUsers, createMessage, deleteUser } from '../utils/tools'

let users = {}
let count = 1
export const socketIOController = io => socket =>{
    const { name, room } =socket.handshake.query
    console.log('client connected: ['+ count++ +']' + socket.id)
    // console.log("Name: " + name, "Room: " + room)
    // socket.join(room)

    socket.on( events.NEW_USER, user => {
        console.log("SOCK: " + socket.id)
        users = addUsers( users, user )
        socket.user = user
        io.emit( events.NEW_USER, { newUsers: users })
    })

    socket.on( events.MESSAGE_SEND, ({ receiver, msg }) => {
        try{
            if( socket.user ){
                let sender = socket.user.username
                let message = createMessage( msg, sender )
                socket.to( receiver.socketId ).emit( events.MESSAGE_SEND, { channel:sender, message, status:'direct' })
                socket.emit( events.MESSAGE_SEND, { channel: receiver.username, message, status:'public' })
            }
        }catch(error){
            console.log(error.name)
        }
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