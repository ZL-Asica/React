import fs from 'node:fs'
import path from 'node:path'

const documentationDirectory = path.resolve('./docs/docs')
let renamedIndexFiles = 0

// Rename README.md to index.md and fix links containing 'functions/'
function renameREADMEtoIndex(filePath) {
  const newPath = path.join(path.dirname(filePath), 'index.md')

  // Read file content and fix 'functions/' links
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replaceAll('functions/', './')

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

    if (line.startsWith('## Index') || line.startsWith('### Functions')) {
      continue
    }
    else if (line.startsWith('## Modules')) {
      line = line.replace('## Modules', '# Documentation')
    }
    else if (line.startsWith('# Function:')) {
      line = line.replace('# Function:', '#')
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

// Move files out of 'functions' folder and delete the folder
function moveOutFunctions(directory) {
  const functionsDirectory = path.join(directory, 'functions')
  if (
    fs.existsSync(functionsDirectory)
    && fs.statSync(functionsDirectory).isDirectory()
  ) {
    const files = fs.readdirSync(functionsDirectory)

    // Move all files to the parent directory
    let movedFiles = 0
    for (const file of files) {
      const oldPath = path.join(functionsDirectory, file)
      const newPath = path.join(directory, file)
      fs.renameSync(oldPath, newPath)
      movedFiles++
    }
    console.log(`Moved ${movedFiles} files out of 'functions' folder.`)

    // Delete the 'functions' folder if it's empty
    fs.rmdirSync(functionsDirectory)
    console.log(`Deleted empty folder: ${functionsDirectory}`)
  }
}

// Traverse and process documents
function traverseDocuments(directory) {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const fullPath = path.join(directory, file)

    if (fs.statSync(fullPath).isDirectory()) {
      traverseDocuments(fullPath)

      // Handle 'functions' directory specifically
      if (path.basename(fullPath) === 'functions') {
        moveOutFunctions(path.dirname(fullPath))
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
