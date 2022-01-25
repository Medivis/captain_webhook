// Module Includes
//=============================================================================================
const express = require('express')
const router = express.Router()
const HookApi = require('../logic/hooks')


// Routes
//=============================================================================================

/**
 * Default API route. Simply shows that the Api is running
 */
router.get('/info', function (req, res) {
  res.send("Captain WebHook API v1")
})

/**
 * WebHook Lock Set to prevent double processes
 */
const hookLock = new Set([]);

/**
 * WebHook Api, for triggering webhooks
 */
router.post('/hook/:id', async function (req, res) {
  const id = req.params.id
  const hooks = await HookApi.getAllHooks()
  const hook = hooks[id]

  if (!hook) return res.sendStatus(404)
  if (hookLock.has(id)) return res.sendStatus(409)
  hookLock.add(id)
  
  try {
    var spawn = require('child_process').spawn;

    var child = spawn(hook.cmd.join(' && '), {
      shell: true
    });
    child.stderr.on('data', function (data) {
      console.error(data.toString())
    });
    child.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    child.on('exit', function (exitCode) {
      hookLock.delete(id)
    });
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(500)
  }
}) 


module.exports = router;