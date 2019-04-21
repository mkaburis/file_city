/* eslint-disable no-console */
// 
// FileManagement.js
// Designed by Mihail Kaburis
// Advanced Javascript Spring 2019


//////////////////////////
/// REQUIRED PACKAGES ///
////////////////////////

const fs = require('fs-extra');
const path = require('path');
const { dialog } = require('electron').remote

//////////////////////////
/// Global Variables ///
////////////////////////

let currentWorkingDirectory = process.cwd();

console.log(dialog);

// console.log(`Starting directory: ${process.cwd()}`);
// try {
//   process.chdir('/');
//   console.log(fs.readdirSync(process.cwd()));
//   console.log(`New directory: ${process.cwd()}`);
// } catch (err) {
//   console.error(`chdir: ${err}`);
// }



// Gets list of file and directory names
function getFileList() {
  // eslint-disable-next-line no-undef
  const fileList = fs.readdirSync(currentWorkingDirectory); // .forEach(file => {
  //   console.log(file);
  // });
  return fileList;
}


// Allows user to select a directory to change to
function selectDirectory() {
    let options = {
      // See place holder 1 in above image
      title : "Change Directories", 
      
      // See place holder 2 in above image
      defaultPath : currentWorkingDirectory,
      
      // See place holder 3 in above image
      buttonLabel : "Change Directory",
      
  
      properties: ['openDirectory']
     }
  
     dialog.showOpenDialog(options, (destination) => {
      let newDir = destination[0];
      process.chdir(newDir);
      // Update the current working directory
      currentWorkingDirectory = process.cwd();
     })
}

// Changes directory given a directory name to change to
function changeDirectory(dirName) {
    process.chdir(dirName);    
    // Update the current working directory
    currentWorkingDirectory = process.cwd();
}

// Creates an empty file in the current working directory
function createFile(fileName) {
    fs.open(fileName, 'wx', (err, fd) => {
      if(err)
        console.log(`${fileName} already exists`);
      else
        console.log('File successfully written!')
    });
     
  }

// Removes a file from the curent working directory
function removeFile(fileName){

    fs.remove(fileName, (err) => {
        if (err) {
            console.log('There was an error deleting the file!');
            return;
        }
        console.log('File deleted successfully!')
    }
    );
}

// Creates an empty directory in the current working directory
function createDirectory(dirName){
  if (fs.existsSync(dirName)) {
    console.log(`The directory ${dirName} already exists!`);
  }
  else if (!fs.existsSync(dirName)){
    fs.mkdirSync(dirName);
    console.log(`The directory ${dirName} has been created!`)
}
}

// Remove a directory the current working directory
function removeDirectory(dirName){
  fs.remove(dirName, (err) => {
    if (err) {
        console.log('There was an error deleting the file!');
        return;
    }
    console.log('Directory deleted successfully!')
}
);
}

function copyFile(fileName) {

  // Get the file path for the File given
  let srcPath = path.join(currentWorkingDirectory, fileName);
  console.log(srcPath)

  let options = {
    // See place holder 1 in above image
    title : "Copy Files", 
    
    // See place holder 2 in above image
    defaultPath : "/",
    
    // See place holder 3 in above image
    buttonLabel : "Copy",
    

    properties: ['openDirectory']
   }

   dialog.showOpenDialog(options, (destination) => {
    let dstPath = path.join(destination[0], fileName)
    fs.copy(srcPath, dstPath)
    .then(() => window.alert(`The file ${fileName} has been successfully copied!`))
    .catch(err => window.alert(err))
   })
}

function moveFile(fileName) {

  // Get the file path for the File given
  let srcPath = path.join(currentWorkingDirectory, fileName);
  console.log(srcPath)

  let options = {
    // See place holder 1 in above image
    title : "Move Files", 
    
    // See place holder 2 in above image
    defaultPath : "/",
    
    // See place holder 3 in above image
    buttonLabel : "Move",
    

    properties: ['openDirectory']
   }

   dialog.showOpenDialog(options, (destination) => {
    let dstPath = path.join(destination[0], fileName)
    fs.move(srcPath, dstPath)
    .then(() => window.alert(`The file ${fileName} has been successfully moved!`))
    .catch(err => window.alert(err))
   })
}

function fileInfo(fileName) {
  let filePath = path.join(currentWorkingDirectory, fileName)
  const statObj = fs.statSync(filePath)
  window.alert(statObj.size);
}

module.exports = {
  getFileList
};
