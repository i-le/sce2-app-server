const {ChatModel} = require('../models')

module.exports = function(server) {

  const io = require('socket.io')(server)

  io.on('connection', function(socket) {
    console.log('socket coonected')

    socket.on('sendMsg', function({from, to, content}) {
      console.log('sever succsfully accepted msg from client side', {from, to, content})
      // 处理数据（保存消息）
      // prep chatMsg obj's data
      const chat_id = [from, to].sort().join('_') //无论那种方式排序 都只有2个结果，from -> to || to -> from 
      const create_time = Date.now()
      new ChatModel({from, to, content, chat_id, create_time}).save(function(err, chatMsg) {
        // sedning msg to client side（A,B..)
        // io: 所有连接的客户端（暂时简单实现）
        io.emit('receiveMsg', chatMsg)
        console.log('chagMsg', chatMsg)
      })
    })
  })
}