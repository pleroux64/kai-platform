import { TOOL_NAMES } from '@/constants/tool_IDs';

import { transformToolData } from '@/services/toolHistory/transformToolData';

const COMPONENTS = {};
const req = require.context(
  '../../components/ToolOutputHistoryDrawer/tools',
  true,
  /\.js$/
);

req.keys().forEach((key) => {
  const componentName = key.replace('./', '').replace('.js', '');
  COMPONENTS[componentName] = req(key).default;
});

/**
 * Returns the transformed data and corresponding component for a given tool session.
 *
 * @param {Object} toolData - The data of the tool to be transformed.
 * @returns {Object} An object containing the transformed data and the corresponding component.
 */
export const getLiveToolData = (toolData) => {
  const transformedData = transformToolData(toolData);
  const componentName = TOOL_NAMES[toolData.tool_id];
  const Component = COMPONENTS[componentName];
  return {
    transformedData,
    Component,
  };
};
