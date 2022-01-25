const fs = require('fs/promises')
const fsOld = require('fs')
const Paths = require('../../paths.json')
const Path = require('path');
const { v4: uuidv4 } = require('uuid')
const editJsonFile = require("edit-json-file");


const validatePath = (path) => {
  if (!fsOld.existsSync(path)) {
    fsOld.mkdirSync(path, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }
}

const cmdStringToJSON = (cmd) => {
  return JSON.stringify(cmd.split(/\r?\n/))
}

const getAllHooks = function () {
  return new Promise(async resolve => {
    const hookdata = {}
    validatePath(Paths.HOOK_FOLDER_PATH)
    const hooks = await fs.readdir(Paths.HOOK_FOLDER_PATH);
    await hooks.forEach((hook) => {
      const fullpath = Path.join(Paths.HOOK_FOLDER_PATH, hook)
      try {
        const file = editJsonFile(fullpath);
        const data = file.get()
        hookdata[data.id] = { id: data.id, name: data.name, cmd: data.cmd, path: fullpath}
      } catch (e) {
        console.error(`Cant read ${fullpath}: File Corrupted`)
      }
    })
    resolve(hookdata)
  })
}

const getAllHooksArray = function () {
  return new Promise(async resolve => {
    const hooks = await getAllHooks()
    const keys = Object.keys(hooks);
    const data = []
    await keys.forEach(key => {
      data.push(hooks[key])
    })
    resolve(data)
  })
}

const createHook = function () {
  return new Promise(async resolve => {
    validatePath(Paths.HOOK_FOLDER_PATH)
    await fs.writeFile(Path.join(Paths.HOOK_FOLDER_PATH, `hook-${Date.now()}.json`), `{
    "name": "New Hook",
    "id": "${uuidv4()}",
    "cmd": []
  }`)
    resolve()
  })
}

const deleteHook = function (id) {
  return new Promise(async resolve => {
    const hooks = await getAllHooks()
    const filePath = hooks[id].path
    await fs.unlink(filePath)
    resolve()
  })
}

const updateHook = function (id, data) {
  return new Promise(async resolve => {
    validatePath(Paths.HOOK_FOLDER_PATH)
    const hooks = await getAllHooks()
    const filePath = hooks[id].path

    await fs.writeFile(filePath, `{
    "name": "${data.name}",
    "id": "${id}",
    "cmd": ${cmdStringToJSON(data.cmd)}
    }`)
    resolve()
  })
}

module.exports.getAllHooks = getAllHooks
module.exports.getAllHooksArray = getAllHooksArray
module.exports.createHook = createHook
module.exports.deleteHook = deleteHook
module.exports.updateHook = updateHook
