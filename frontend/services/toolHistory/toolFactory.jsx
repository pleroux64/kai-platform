import { TOOL_NAMES } from '@/constants/tool_IDs';

import { transformToolData } from '@/services/toolHistory/transformToolData';

const TOOL_RENDERERS = {};
const req = require.context(
  '../../components/ToolOutputHistoryDrawer/toolRenderers',
  true,
  /\.jsx$/
);

req.keys().forEach((key) => {
  const toolRendererName = key.replace('./', '').replace('.jsx', '');
  TOOL_RENDERERS[toolRendererName] = req(key).default;
});

// Log the renderers to verify import
console.log('Imported tool renderers:', TOOL_RENDERERS);

/**
 * Returns the transformed data and corresponding renderer for a given tool session.
 *
 * @param {Object} toolData - The data of the tool to be transformed.
 * @returns {Object} An object containing the transformed data and the corresponding renderer function.
 */
export const getLiveToolData = (toolData) => {
  const transformedData = transformToolData(toolData);
  const toolRendererName = TOOL_NAMES[toolData.tool_id];
  console.log(
    'Mapped tool_id',
    toolData.tool_id,
    'to tool renderer name:',
    toolRendererName
  );
  const toolRenderer = TOOL_RENDERERS[toolRendererName];
  console.log('Renderer found for name:', toolRendererName, toolRenderer);
  return {
    transformedData,
    toolRenderer,
  };
};
