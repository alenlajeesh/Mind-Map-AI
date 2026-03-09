const axios = require('axios');
const Note = require('../models/Note');
const Node = require('../models/Node');
const normalize = (text) => text?.replace(/\s+/g, ' ').trim();
// Helper function to normalize text (remove extra spaces/newlines)
const generateNoteSummary = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (!note.content?.trim()) {
      return res.status(400).json({ message: 'Please enter note content to generate summary.' });
    }

    const promptText = `
Return ONLY JSON, no other text. Format:
{
  "heading": "string",
  "body": "string", 
  "importantPoints": ["array", "of", "strings"],
  "examples": ["array", "of", "strings"]
}

Content: ${note.content}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.1,
        }
      }
    );

    if (!response.data?.candidates?.length) {
      return res.status(500).json({ message: 'Gemini API returned no content' });
    }

    let aiText = response.data.candidates[0].content.parts[0].text || '';
    
    // EXTRACT CLEAN JSON - SIMPLE AND DIRECT
    let cleanJson = aiText;
    
    // Remove everything before first {
    const startIndex = cleanJson.indexOf('{');
    if (startIndex !== -1) {
      cleanJson = cleanJson.substring(startIndex);
    }
    
    // Remove everything after last }
    const endIndex = cleanJson.lastIndexOf('}');
    if (endIndex !== -1) {
      cleanJson = cleanJson.substring(0, endIndex + 1);
    }
    
    // Parse the clean JSON
    let summaryData;
    try {
      summaryData = JSON.parse(cleanJson);
    } catch (err) {
      // If parsing fails, create fallback
      summaryData = {
        heading: `Summary of ${note.title}`,
        body: aiText.replace(/```json|```/g, '').trim(),
        importantPoints: [],
        examples: []
      };
    }

    // Ensure proper structure
    const finalSummary = {
      heading: summaryData.heading || `Summary of ${note.title}`,
      body: summaryData.body || 'No summary generated',
      importantPoints: Array.isArray(summaryData.importantPoints) ? summaryData.importantPoints : [],
      examples: Array.isArray(summaryData.examples) ? summaryData.examples : [],
      originalContent: note.content,
      lastGeneratedAt: new Date()
    };

    note.aiSummary = finalSummary;
    await note.save();

    return res.status(200).json({ summary: finalSummary, cached: false });
    
  } catch (error) {
    console.error('Error generating summary:', error.message);
    return res.status(500).json({ message: 'Error generating summary', error: error.message });
  }
};

/**
 * Generate AI nodes for mind map from summary
 *//**
 * Generate AI nodes for mind map from summary
 */
const generateNoteNodes = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    // Check that note exists, summary exists, and content hasn't changed
    if (
      !note ||
      !note.aiSummary ||
      !note.aiSummary.body ||
      normalize(note.aiSummary.originalContent) !== normalize(note.content)
    ) {
      return res.status(404).json({ message: 'Note or summary not found or content has changed' });
    }

    const promptText = `
Based on this summary, create a mind map structure for learning.
- Use parent-child hierarchy
- Each parent node represents a main topic
- Each child node represents a subtopic or key point
- Return strictly as JSON like this:
[
  {
    "title": "Main Topic 1",
    "children": [
      { "title": "Subtopic 1", "children": [] }
    ]
  }
]

Summary to use:
${note.aiSummary.body}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        contents: [{ parts: [{ text: promptText }] }],
      }
    );

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    console.log('Raw AI response:', aiText);

    //  ROBUST JSON EXTRACTION - handles any user input
    let cleanedText = aiText.trim();
    
    // Remove ALL markdown code blocks (json, javascript, etc.)
    cleanedText = cleanedText.replace(/```[a-z]*\s*/gi, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    // Try multiple extraction strategies
    let parsedNodes;
    
    // Strategy 1: Extract JSON array between [ and ]
    const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        parsedNodes = JSON.parse(arrayMatch[0]);
      } catch (err) {
        console.log('Strategy 1 failed, trying strategy 2...');
      }
    }
    
    // Strategy 2: Extract JSON object between { and }
    if (!parsedNodes) {
      const objectMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          parsedNodes = JSON.parse(objectMatch[0]);
          // If it's a single object, wrap in array
          if (parsedNodes && !Array.isArray(parsedNodes)) {
            parsedNodes = [parsedNodes];
          }
        } catch (err) {
          console.log('Strategy 2 failed, trying strategy 3...');
        }
      }
    }
    
    // Strategy 3: Direct parse of cleaned text
    if (!parsedNodes) {
      try {
        parsedNodes = JSON.parse(cleanedText);
      } catch (err) {
        console.log('Strategy 3 failed, using fallback...');
      }
    }
    
    // Final fallback: Create basic structure from summary
    if (!parsedNodes || !Array.isArray(parsedNodes)) {
      console.log('Using fallback node structure');
      parsedNodes = [
        { 
          title: 'Main Topics', 
          children: [
            { title: 'Key Point 1', children: [] },
            { title: 'Key Point 2', children: [] },
            { title: 'Key Point 3', children: [] }
          ] 
        }
      ];
    }

    console.log('Final parsed nodes:', JSON.stringify(parsedNodes, null, 2));

    // Clear existing nodes for this note
    await Node.deleteMany({ noteId: note._id });

    // Save nodes in DB with proper hierarchy
    const saveNodeHierarchy = async (nodes, parentId = null) => {
      for (const node of nodes) {
        const savedNode = await Node.create({
          noteId: note._id,
          title: node.title || 'Untitled Node',
          parentId: parentId,
          hasChildren: node.children && node.children.length > 0
        });

        // Recursively save children
        if (node.children && Array.isArray(node.children)) {
          await saveNodeHierarchy(node.children, savedNode._id);
        }
      }
    };

    await saveNodeHierarchy(parsedNodes);

    return res.status(200).json({
      message: 'Mind map nodes generated successfully',
      data: parsedNodes,
    });
  } catch (error) {
    console.error('Error generating mind map nodes:', error.message);
    return res.status(500).json({ 
      message: 'Error generating mind map nodes', 
      error: error.message 
    });
  }
};


module.exports = { generateNoteSummary, generateNoteNodes, };
