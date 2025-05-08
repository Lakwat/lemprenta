// scripts/validateFrontmatter.js

// Import necessary modules
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // We'll install this in the next step (Step 57)
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// --- 1. Initialize AJV and add formats ---
const ajv = new Ajv({ allErrors: true }); // 'allErrors: true' provides more detailed error reporting
addFormats(ajv); // Adds support for formats like 'date', 'email', etc.

// --- 2. Define the JSON Schema for your frontmatter ---
// This schema defines what fields are expected, their types, and if they are required.
// Customize this schema to match your blog's frontmatter requirements.
const frontmatterSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 }, // Title must be a non-empty string
    date: { type: 'string', format: 'date' }, // Date must be a string in 'YYYY-MM-DD' format
    layout: { type: 'string', minLength: 1 }, // Layout must be a non-empty string
    tags: {
      type: 'array',
      items: { type: 'string', minLength: 1 }, // Each tag must be a non-empty string
      minItems: 1, // Optional: require at least one tag
      uniqueItems: true // Optional: ensure tags are unique
    },
    description: { type: 'string', minLength: 10, maxLength: 160 }, // Optional: description with length constraints
    // Add any other custom fields you use and want to validate
    // For example:
    // featured_image: { type: 'string', format: 'url', nullable: true }, // Optional URL for a featured image
    // author: { type: 'string', minLength: 1, nullable: true } // Optional author string
  },
  required: ['title', 'date', 'layout'], // Specify which fields are mandatory
  additionalProperties: true // Set to 'false' to disallow any properties not defined in the schema
                             // Set to 'true' (or remove) to allow extra properties
};

// --- 3. Compile the schema ---
// Compiling the schema improves performance if you validate many times.
const validate = ajv.compile(frontmatterSchema);

// --- 4. Function to get all Markdown files from the posts directory ---
function getPostFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getPostFiles(filePath, arrayOfFiles);
    } else if (path.extname(file) === '.md') {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// --- 5. Main validation logic ---
function validateAllFrontmatter() {
  // Adjust the path to your posts directory as needed.
  // This assumes your posts are in 'content/posts/' relative to the project root.
  const postsDirectory = path.join(__dirname, '..', 'content', 'posts');
  const postFiles = getPostFiles(postsDirectory);
  let allValid = true;

  console.log(`Found ${postFiles.length} post(s) to validate...`);

  postFiles.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: postBody } = matter(fileContent); // 'matter' parses the YAML frontmatter

    // Add the filename to the frontmatter object for better error reporting
    const frontmatterWithFile = { ...frontmatter, _filename: path.basename(filePath) };

    if (validate(frontmatter)) {
      // console.log(`Frontmatter for ${path.basename(filePath)} is valid.`);
    } else {
      allValid = false;
      console.error(`\n--- Validation Error in: ${path.basename(filePath)} ---`);
      validate.errors.forEach(error => {
        // Customize error message for better readability
        let errorMessage = `  Property: ${error.instancePath.substring(1) || 'root'}`;
        errorMessage += ` - Message: ${error.message}`;
        if (error.params && error.params.allowedValues) {
          errorMessage += ` (allowed: ${error.params.allowedValues.join(', ')})`;
        } else if (error.params && error.params.format) {
          errorMessage += ` (expected format: ${error.params.format})`;
        }
        console.error(errorMessage);
      });
      // console.error("Full error object:", JSON.stringify(validate.errors, null, 2));
    }
  });

  if (allValid) {
    console.log('\nAll frontmatter validated successfully! 🎉');
    process.exit(0); // Exit with success code
  } else {
    console.error('\nFrontmatter validation failed for one or more posts. Please check the errors above. ❌');
    process.exit(1); // Exit with error code (important for CI)
  }
}

// --- 6. Run the validation ---
validateAllFrontmatter();
