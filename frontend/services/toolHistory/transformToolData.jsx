import moment from 'moment';

import { TOOL_IDS } from '@/constants/tool_IDs';

/**
 * Transforms tool data into a structured format based on the tool type.
 * @param {Object} toolData - The data of the tool to be transformed.
 * @returns {Object} The transformed tool data with specific details like title, description, and creation date.
 */
export const transformToolData = (toolData) => {
  const { tool_id, topic, response, title, content, createdAt } = toolData;

  console.log('Incoming tool data:', toolData);

  const transformedDate = createdAt?.seconds
    ? moment(createdAt.seconds * 1000)
        .toDate()
        .toLocaleDateString()
    : 'Unknown Date';

  const TOOL_OUTPUT_DETAILS = {
    [TOOL_IDS.FLASHCARDS]: {
      backgroundImageUrl:
        'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Dynamo.png?alt=media&token=db14183f-a294-49b2-a9de-0818b007c080',
      logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/YoutubeLogo.png?alt=media&token=2809083f-f816-41b6-8f86-80582b3da188',
      getTitle: () => {
        if (title) return title;

        const concepts = response?.map((item) => item.concept) || [];
        const primaryConcept = concepts[0] || 'Various Concepts';

        return `Flashcards on ${primaryConcept} and More`;
      },
      getDescription: () => {
        if (content) return content;

        const concepts = response?.map((item) => item.concept) || [];
        const notableConcepts =
          concepts.length > 1
            ? concepts.slice(0, 1).join(', ') +
              (concepts.length > 2 ? ', and ' : ' and ') +
              concepts[concepts.length - 1]
            : concepts[0] || 'Various Concepts';

        return `Includes concepts like ${notableConcepts}`;
      },
    },
    [TOOL_IDS.MCQ]: {
      backgroundImageUrl:
        'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Quizify.png?alt=media&token=d1255f27-b1a1-444e-b96a-4a3ac559237d',
      logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/QuizifyLogo.png?alt=media&token=9bf1d066-fba4-4063-9640-ef732e237d31',
      getTitle: () => title || `Multiple Choice Assessment - ${topic}`,
      getDescription: () =>
        content || `Multiple Choice Questions taken from ${topic}`,
    },
  };

  const defaultDetails = {
    backgroundImageUrl:
      'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Dynamo.png?alt=media&token=db14183f-a294-49b2-a9de-0818b007c080',
    logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/YoutubeLogo.png?alt=media&token=2809083f-f816-41b6-8f86-80582b3da188',
    getTitle: () => 'Unknown Tool Usage',
    getDescription: () => 'This tool usage is not defined.',
  };

  const toolDetails = TOOL_OUTPUT_DETAILS[tool_id] || defaultDetails;

  console.log('Transformed tool data:', {
    ...toolDetails,
    creationDate: transformedDate,
    title: toolDetails.getTitle(),
    description: toolDetails.getDescription(),
    response,
  });

  return {
    ...toolDetails,
    creationDate: transformedDate,
    title: toolDetails.getTitle(),
    description: toolDetails.getDescription(),
    response,
  };
};
