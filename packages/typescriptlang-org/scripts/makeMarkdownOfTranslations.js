// @ts-enable

//  node packages/typescriptlang-org/scripts/makeMarkdownOfTranslations.js [lang]

const { join, basename } = require("path")
const { recursiveReadDirSync } = require("../lib/utils/recursiveReadDirSync")
const { read } = require("gray-matter")

const getAllTODOFiles = lang => {
  const diffFolders = (root, lang) => {
    const en = join(root, "en")
    const thisLang = join(root, lang)

    const englishFiles = recursiveReadDirSync(en)
    const thisLangFiles = recursiveReadDirSync(thisLang)

    const todo = []
    const done = []
    englishFiles.forEach((en, index) => {
      const localFile = en.replace("/en/", "/" + lang + "/")
      if (thisLangFiles.includes(localFile)) {
        done.push(localFile)
      } else {
        todo.push(en)
      }
    })

    return { todo, done }
  }

  // TS Config
  const tsconfigRoot = join(__dirname, "..", "..", "tsconfig-reference", "copy")
  const tsconfigFilesTODO = diffFolders(tsconfigRoot, lang)

  // Playground
  const playRoot = join(__dirname, "..", "..", "playground-examples", "copy")
  const playgroundTODO = diffFolders(playRoot, lang)

  // Layouts
  const appRoot = join(__dirname, "..", "src", "copy")
  const appTODO = diffFolders(appRoot, lang)

  const docsRoot = join(__dirname, "..", "..", "documentation", "copy")
  const docsTODO = diffFolders(docsRoot, lang)
  docsTODO.todo = docsTODO.todo.filter(
    path => read(join(__dirname, "..", "..", path)).data.translatable
  )

  const all = {
    tsconfig: tsconfigFilesTODO,
    playground: playgroundTODO,
    app: appTODO,
    docs: docsTODO,
  }

  return all
}

let totalDone = 0
let totalTodo = 0

const toMarkdown = files => {
  const md = [""]

  const markdownLink = (f, done) => {
    const name = basename(f)
    const url =
      "https://github.com/microsoft/TypeScript-Website/blob/v2/packages"
    const check = done ? "x" : " "
    return `- [${check}] [\`${name}\`](${url}${f.replace(/ /g, "%20")})`
  }

  Object.keys(files).forEach(section => {
    const todo = files[section].todo
    const done = files[section].done

    md.push("\n\n## " + section + "\n")
    md.push(`Done: ${done.length}, TODO: ${todo.length}.\n\n`)
    done.forEach(f => {
      md.push(markdownLink(f, true))
    })

    todo.forEach(f => {
      md.push(markdownLink(f))
    })

    totalDone += done.length
    totalTodo += todo.length
  })

  md[0] = `For this language there are ${totalDone} translated files, with ${totalTodo} TODO.\n\n`
  return md.join("\n")
}

if (!module.parent) {
  const lang = process.argv.slice(2)[0]
  if (!lang) {
    console.log("You need to run this script with a language arg")
    console.log(
      "> node packages/typescriptlang-org/scripts/makeMarkdownOfTranslations.js jp"
    )
  }

  const files = getAllTODOFiles(lang)
  console.log(toMarkdown(files))
}

module.exports = { toMarkdown, getAllTODOFiles }
