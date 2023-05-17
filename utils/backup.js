const workBook = XLSX.utils.book_new();
let tot = [];
posts.forEach(pop=>{
  test={
    id:pop.id,
    title:pop.title,
    content:pop.content,
    image:pop.image
  }
  tot.push(test);
})
 
  const workSheetColumName=[
    "ID",
    "TITLE",
    "CONTENT",
    "IMAGE"
  ]
  const filePath = "./utils/user.xlsx"


  
const workSheet = XLSX.utils.json_to_sheet(tot)
  
XLSX.utils.book_append_sheet(workBook,workSheet,"Sheet4")
  
// Writing to our file
XLSX.writeFile(workBook,path.resolve(filePath))