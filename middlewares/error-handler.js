// middlewares/error-handler.js

export default (err, req, res, next) => {
  
  res.status(err.status || 500)

  // if you want to use json, you can use res.json instead of res.render
  res.json({
  status: 'error',
  message: err.message
  })
}