interface ScriptOptions {
  isDryRun?: boolean;
}

interface Script {
  run: (options: ScriptOptions) => string;
}
