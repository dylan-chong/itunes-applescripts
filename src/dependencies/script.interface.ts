interface RunScriptFunc {
  ():String
}

interface Script {
  run:RunScriptFunc
}
