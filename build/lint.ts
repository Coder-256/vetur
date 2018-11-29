import * as prettier from "prettier";
import * as eslint from "eslint";
import * as fs from "fs";

var cli: eslint.CLIEngine | undefined;
for (const file of process.argv.slice(2)) {
  if (/((t|j)sx?|vue)$/.test(file))
    eslint.CLIEngine.outputFixes(
      (cli || (cli = new eslint.CLIEngine({ fix: true }))).executeOnFiles([
        file
      ])
    );

  const fileInfo = prettier.getFileInfo.sync(file);
  if (!fileInfo.ignored && fileInfo.inferredParser)
    fs.writeFileSync(
      file,
      prettier.format(fs.readFileSync(file).toString(), {
        parser: fileInfo.inferredParser as any,
        ...prettier.resolveConfig.sync(file)
      })
    );
}
