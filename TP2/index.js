const http = require('http')
const handles = require('./handles')
const server = http.createServer(handles.serverHandle);
server.listen(8080)
path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
