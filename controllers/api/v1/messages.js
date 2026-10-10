import Message from "../../../models/api/v1/Message.js"


// GET alle berichten
export const list = async (req, res, next) => {
  try {

    const { user } = req.query

    let messages

    if (user) {
      messages = await Message.find({ user: user })
    } else {
      messages = await Message.find({})
    }

    res.json({
      status: 'success',
      message: 'GETTING messages',
      data: {
        messages: messages
      }
    })

  } catch (err) {
    next(err)
  }
}


// GET één bericht
export const show = async (req, res, next) => {
  try {

    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: `Message ${req.params.id} not found`,
        data: {
          id: req.params.id
        }
      })
    }

    res.json({
      status: 'success',
      message: `GETTING message ${req.params.id}`,
      data: {
        message: message
      }
    })

  } catch (err) {
    next(err)
  }
}


// POST nieuw bericht
export const create = async (req, res, next) => {
  try {

    const newData = req.body.message

    if (!newData || !newData.user || !newData.text) {
      return res.status(400).json({
        status: 'fail',
        message: 'User and text are required',
        data: {
          message: null
        }
      })
    }

    const message = new Message({
      user: newData.user,
      text: newData.text
    })

    await message.save()

    res.status(201).json({
      status: 'success',
      message: 'Message saved',
      data: {
        message: message
      }
    })

  } catch (err) {
    next(err)
  }
}


// PUT bestaand bericht aanpassen
export const update = async (req, res, next) => {
  try {

    const changes = req.body.message

    if (!changes) {
      return res.status(400).json({
        status: 'fail',
        message: 'Message is required',
        data: {
          message: null
        }
      })
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        user: changes.user,
        text: changes.text
      },
      {
        new: true
      }
    )

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: `Message ${req.params.id} not found`,
        data: {
          id: req.params.id
        }
      })
    }

    res.json({
      status: 'success',
      message: 'Message updated',
      data: {
        message: message
      }
    })

  } catch (err) {
    next(err)
  }
}


// DELETE bericht
export const destroy = async (req, res, next) => {
  try {

    const message = await Message.findByIdAndDelete(req.params.id)

    if (!message) {
      return res.status(404).json({
        status: 'fail',
        message: `Message ${req.params.id} not found`,
        data: {
          id: req.params.id
        }
      })
    }

    res.json({
      status: 'success',
      message: 'Message deleted'
    })

  } catch (err) {
    next(err)
  }
}