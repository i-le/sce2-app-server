module.exports = function(server) {
    // get io obg
    const io = require('socket.io')(server)
    // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function(socket) {
      console.log('socket coonected')
      // 绑定sendMsg监听，receving all msg from client side
      socket.on('sendMsg', function(data) {
        console.log('server reserviced msg from client', data)
        // data modifiling 
        data.name = data.name.toUpperCase()
        // sending msg to client (users and data)
        // sending msg to current socket matchs current user；io.emit(): 发送给所有连接服务器的客户端
        io.emit('receiveMsg', data.name + '-' + data.date)
        console.log('server is sending data to clinet', data)
      })
    })
  }