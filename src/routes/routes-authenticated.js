// Module Includes
//=============================================================================================
const express = require('express')
const router = express.Router()

const { v4: uuidv4 } = require('uuid')
const config = require('../../config.json')
const HookApi = require('../logic/hooks')


// Routes
//=============================================================================================

/**
 * Returns the requested Article as plain markdown
 */
router.get('/', async function (req, res) {
  const hookdata = await HookApi.getAllHooksArray()
  res.render('index', { hooks: hookdata, baseurl: config.BASE_URL })
}) 

/**
 * adds a new hook
 */
router.post('/hook', async function (req, res) {
  await HookApi.createHook()
  res.redirect('/')
}) 

/**
 * deletes a hook
 */
router.post('/hook/:id/delete', async function (req, res) {
  await HookApi.deleteHook(req.params.id)
  res.redirect('/')
}) 

/**
 * updates the name and command of a webhook
 */
router.post('/hook/:id/update', async function (req, res) {
  await HookApi.updateHook(req.params.id, req.body)
  res.redirect('/')
}) 

module.exports = router;