import fs from 'node:fs'
import path from 'node:path'

const documentationDirectory = path.resolve('./docs/docs')
let renamedIndexFiles = 0

// Rename README.md to index.md and fix links containing 'functions/', 'variables/', or 'types/'
function renameREADMEtoIndex(filePath) {
  const newPath = path.join(path.dirname(filePath), 'index.md')

  // Read file content and fix 'functions/', 'variables/', or 'types/' links
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replaceAll('functions/', './').replaceAll('variables/', './').replaceAll('types/', './').replaceAll('[@zl-asica/react/', '[').replaceAll('](@zl-asica/react/', '](')

  // Write the fixed content back
  fs.writeFileSync(filePath, content, 'utf8')

  // Rename the file
  fs.renameSync(filePath, newPath)
}

// Fix Markdown content
function fixMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const newContent = lines.slice(6)
  const newLines = []

  let skipProcessing = false

  for (let line of newContent) {
    if (skipProcessing) {
      newLines.push(line)
      continue
    }

    if (line.startsWith('## Index') || line.startsWith('### Functions') || line.startsWith('### Variables') || line.startsWith('### Types')) {
      continue
    }
    else if (line.startsWith('## Modules')) {
      line = line.replace('## Modules', '# Documentation')
    }
    else if (line.startsWith('# Function:')) {
      line = line.replace('# Function:', '#')
    }
    else if (line.startsWith('# Variable:')) {
      line = line.replace('# Variable:', '#')
    }
    else if (line.startsWith('# Type:')) {
      line = line.replace('# Type:', '#')
    }
    else if (line.startsWith('## Example')) {
      skipProcessing = true
      newLines.push(line)
      continue
    }

    line = line
      .replaceAll(/README.md/g, '')
      .replaceAll(/<([A-Z]+)>/gi, '&lt;$1&gt;')

    newLines.push(line)
  }

  const fixedContent = newLines.join('\n')
  fs.writeFileSync(filePath, fixedContent, 'utf8')
}

// Move files out of 'functions', 'variables', and 'types' folders and delete the folders
function moveOutFunctionsVariablesTypes(directory, type) {
  const subDirectory = path.join(directory, type)

  if (
    (fs.existsSync(subDirectory)
      && fs.statSync(subDirectory).isDirectory())
  ) {
    const files = fs.readdirSync(subDirectory)

    // Move all files to the parent directory
    let movedFiles = 0
    for (const file of files) {
      const oldPath = path.join(subDirectory, file)
      const newPath = path.join(directory, file)
      fs.renameSync(oldPath, newPath)
      movedFiles++
    }
    console.log(`Moved ${movedFiles} files out of '${type}' folder.`)

    // Delete the 'functions', 'variables', or 'types' folder if it's empty
    fs.rmdirSync(subDirectory)
    console.log(`Deleted empty folder: ${subDirectory}`)
  }
}

// Rename scoped folders like "@zl-asica/react/utils" to "utils"
function renameScopedUtilsFolder(directory) {
  const parts = directory.split(path.sep)
  const lastPart = parts.at(-1)

  const grandparent = parts.at(-3)

  if (grandparent && grandparent.startsWith('@zl-asica')) {
    const newPath = path.join('/', ...parts.slice(1, -3), lastPart)

    if (!fs.existsSync(directory)) {
      console.warn(`⚠️ Folder to rename does not exist: ${directory}`)
      return directory
    }

    fs.renameSync(directory, newPath)
    console.log(`🔁 Renamed scoped folder '${directory}' to '${newPath}'`)

    const removeParentFolder = path.join(documentationDirectory, '@zl-asica', 'react')
    const removeGradParentFolder = path.join(documentationDirectory, '@zl-asica')

    try {
      if (fs.existsSync(directory)) {
        fs.rmdirSync(directory)
        console.log(`🗑️ Removed empty folder: ${directory}`)
      }
      if (fs.existsSync(removeParentFolder)) {
        fs.rmdirSync(removeParentFolder)
        console.log(`🗑️ Removed empty folder: ${removeParentFolder}`)
      }
      if (fs.existsSync(removeGradParentFolder)) {
        fs.rmdirSync(removeGradParentFolder)
        console.log(`🗑️ Removed empty folder: ${removeGradParentFolder}`)
      }
    }
    catch (e) {
      console.warn(`⚠️ Failed to clean up parent folders: ${e.message}`)
    }

    return newPath
  }

  return directory
}

// Traverse and process documents
function traverseDocuments(directory) {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const fullPath = path.join(directory, file)

    if (fs.statSync(fullPath).isDirectory()) {
      const renamedPath = renameScopedUtilsFolder(fullPath)
      traverseDocuments(renamedPath)

      // Handle 'functions', 'variables', and 'types' directories specifically
      const baseName = path.basename(renamedPath)
      if (['functions', 'variables', 'types'].includes(baseName)) {
        moveOutFunctionsVariablesTypes(path.dirname(renamedPath), baseName)
      }
    }
    else if (file.endsWith('.md')) {
      fixMarkdown(fullPath)
      if (file === 'README.md') {
        renamedIndexFiles++
        renameREADMEtoIndex(fullPath)
      }
    }
  }
}

// Run the script
traverseDocuments(documentationDirectory)

if (renamedIndexFiles > 0) {
  console.log(`\nRenamed ${renamedIndexFiles} README.md files to index.md and fixed links.`)
}
