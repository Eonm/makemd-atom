'use babel'

import { existsSync } from 'fs'
import { CompositeDisposable } from 'atom'
import { execFile } from 'child_process'
import { dirname } from 'path'
import makemdBin from '@eonm/makemd'
import targets from './targets'

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
      console.log('activate pandoc-convert')
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
    const editor = workspace.getActiveTextEditor()

    if (!editor) {
      return this.error('Current item is not an editor.')
    }

    if (editor.isModified() || !editor.getPath()) {
      return this.error('Text is modified. Please save first.')
    }

    const format = targets[target].format || target
    const args = targets[target].args
    const ipath = editor.getPath()
    this.convert(args, ipath)
  },

  error (message) {
    notifications.addError(`[MakeMD]<br>${message}`)
  },

  success (message) {
    notifications.addSuccess(`[MakeMD]<br>${message}`)
  },
  

  convert (args, ipath) {
     const makemd = config.get('pandoc-convert.makemdBinary') || makemdBin.path

    if (!existsSync(makemd)) {
      return this.error(`Binary \`${makemd}\` does not exist.`)
    }

    var editor = atom.workspace.getActiveTextEditor();
    var cwd = atom.project.relativizePath(editor.getPath())[0]

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
