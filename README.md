# MakeMD

![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg) [![Build Status](https://travis-ci.org/Eonm/makemd-rs.svg?branch=master)](https://travis-ci.org/Eonm/makemd-rs)

**This package is in alpha stage.**

Build your documents with [MakeMD](https://www.makemd.app/).

Available commands (Ctrl+Maj+P) :

* init (Create a new makemd project)
* build pdf
* build pdf individually
* build presentation (Create a reveal.js presentation)
* buil presentation invidually
* update bibliography
* update csl

All configuration are placed in the `.makemd` file. Check the [documentation](https://github.com/Eonm/Make-MD-electron/wiki/.makemd) to know how to edit this file.

Dependencies :

* pandoc
* pandoc-citeproc
* latex (texlive-full)
