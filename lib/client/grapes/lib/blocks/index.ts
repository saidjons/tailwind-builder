import loadBasicBlocks from './basic'
// import loadFormBlocks from './form'
import loadTailwindBlocks from './tailblocks'
// import loadHyperUiBlocks from './hyperui'
// import loadMerakiUiLightBlocks from './merakiui-light'

export function loadBlocks(editor, standaloneServer) {
  loadBasicBlocks(editor)
  loadTailwindBlocks(editor, standaloneServer)
  // loadHyperUiBlocks(editor, standaloneServer)
  // loadMerakiUiLightBlocks(editor, standaloneServer)
}