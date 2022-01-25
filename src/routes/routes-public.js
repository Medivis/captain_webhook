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
 * WebHook Api, for triggering webhooks
 */
router.post('/hook/:id', async function (req, res) {
  const hooks = await HookApi.getAllHooks()
  const hook = hooks[req.params.id]
  if(!hook) return res.sendStatus(404)
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
      res.sendStatus(200)
    });

  } catch (e) {
    res.sendStatus(500)
  }
}) 


module.exports = router;