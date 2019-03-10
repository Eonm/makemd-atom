'use babel'

import { existsSync } from 'fs'
import { CompositeDisposable } from 'atom'
import { execFile } from 'child_process'
import { dirname } from 'path'
import makemdBin from '@eonm/makemd'
import targets from './targets'
import path from 'path'


const { atom } = global

const {
  commands,
  config,
  notifications,
  workspace
} = atom

const cache = {}

module.exports = {

  config: {
    makemdBinary: {
      description: 'Path to MakeMD',
      type: 'string',
      default: ''
    }
  },

  activate () {    
    if (atom.inDevMode() && !atom.inSpecMode()) {
      console.log('activate makemd')
    }

    this.subscriptions = new CompositeDisposable()

    Object.keys(targets).forEach(target => {
      const action = `MakeMD:${target.replace(/_/g, '-')}`

      this.subscriptions.add(commands.add('atom-workspace', action, () => {
        this.convertCommand(target)
      }))
    })
  },
    
  deactivate () {
    this.subscriptions.dispose()
  },
  
  convertCommand (target) {
    const format = targets[target].format || target
    const args = targets[target].args
    this.convert(args)
  },

  error (message) {
    notifications.addError(`[MakeMD]<br>${message}`)
  },

  success (message) {
    notifications.addSuccess(`[MakeMD]<br>${message}`)
  },


  convert (args) {
     const makemd = config.get('makemd.makemdBinary') || makemdBin.path

    if (!existsSync(makemd)) {
      return this.error(`Binary \`${makemd}\` does not exist.`)
    }
    
    let editor = atom.workspace.getActivePaneItem() 
    if (!editor) {
     return this.error("Please select a path in the atom tree-view before runing MakeMD")
    }
    
    let cwd = atom.project.relativizePath(editor.filePath)[0] || atom.project.relativizePath(editor.selectedPath)[0] || atom.project.relativizePath(editor.buffer.file.path)[0] 
    

    let m = execFile(makemd, args, { cwd }, (error, result) => {
      if (error) {
        console.log(error);
        this.error(error.message)
      } else {
        this.success(result)
      }
    })
  },

  defaultOuputPath (ext) {
    const editor = workspace.getActiveTextEditor()
    const dpath = `${editor.getPath()}.${ext}`

    if (cache[dpath]) {
      return cache[dpath]
    }

    return dpath
  }
}
