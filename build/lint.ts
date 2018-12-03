import * as prettier from "prettier";
import * as eslint from "eslint";
import * as fs from "fs";

class File {
  constructor(readonly path: string) {}
  protected contents: string | undefined;
  protected original: string | undefined;
  async read(): Promise<string> {
    return (
      this.contents ||
      this.original ||
      (this.original = await new Promise<string>((resolve, reject) => {
        fs.readFile(this.path, (err, data) => {
          if (err) reject(err);
          else resolve(data.toString());
        });
      }))
    );
  }

  write(contents: string) {
    this.contents = contents;
  }

  async flush() {
    if (this.contents && this.contents != this.original)
      return new Promise((resolve, reject) => {
        fs.writeFile(this.path, this.contents, err => {
          if (err) reject(err);
          else resolve();
        });
      });
  }
}

let cli: eslint.CLIEngine | undefined;
let formatter: eslint.CLIEngine.Formatter | undefined;
async function lintESLint(file: File) {
  if (!/\.((t|j)sx?|vue)$/.test(file.path)) return;
  cli = cli || new eslint.CLIEngine({ fix: true });
  const text = await file.read();
  const report = cli.executeOnText(text, file.path);

  if (!report.results.length) return;

  const unfixable =
    report.results[0].errorCount - report.results[0].fixableErrorCount;
  if (fix) {
    if (!unfixable) {
      const newText = report.results[0].output;
      if (newText && newText != text) await file.write(newText);
      return;
    }
  } else if (report.errorCount == 0) return;

  formatter = formatter || cli.getFormatter("");
  console.error(formatter(report.results));
  throw new Error(
    `ESLint failed with ${unfixable} unfixable error${
      unfixable == 1 ? "" : "s"
    }.`
  );
}

async function lintPrettier(file: File) {
  const fileInfo = await prettier.getFileInfo(file.path);
  if (fileInfo.ignored || !fileInfo.inferredParser) return;
  const options: prettier.Options = {
    parser: fileInfo.inferredParser as any,
    ...(await prettier.resolveConfig(file.path))
  };

  const text = await file.read();
  if (fix) {
    await file.write(prettier.format(text, options));
  } else if (!prettier.check(text, options)) {
    throw new Error("Prettier failed.");
  }
}

const linters: ((file: File) => Promise<void>)[] = [lintESLint, lintPrettier];
async function runLinters(path: string) {
  const file = new File(path);
  try {
    for (const linter of linters) await linter(file);
    await file.flush();
  } catch (error) {
    failedFiles.push(file.path);
    console.error(`Error while linting ${file.path}:`, error);
  }
}

//
// |------|
// | Main |
// |------|
//

const fix = (() => {
  switch (process.argv[2]) {
    case "verify":
      return false;
    case "fix":
      return true;
  }
  console.error("Usage:");
  console.error("lint.sh [verify|fix] file ...");
  return process.exit(1);
})();

let failedFiles: string[] = [];

const promises = process.argv.slice(3).map(path => runLinters(path));

Promise.all(promises).then(() => {
  if (failedFiles.length > 0) {
    console.error("ERROR: The following files failed to lint:");
    for (const file of failedFiles) console.error(file);
    return process.exit(1);
  } else {
    return process.exit(0);
  }
});
