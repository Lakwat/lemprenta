// scripts/generate-og.js

// Import necessary modules
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // For reading frontmatter
const njk = require('nunjucks'); // For rendering the HTML template (install in Step 64)
const slugify = require('slugify'); // For creating filename-safe slugs

// --- Configuration ---
// Path to your Markdown posts directory (relative to project root)
const postsDir = path.join(__dirname, '..', 'content', 'posts');
// Path to your OG image HTML template (relative to project root)
const templatePath = path.join(__dirname, '..', 'templates', '_includes', 'og-image-template.html');
// Output directory for the generated OG images (relative to project root, will be inside _site)
const outputDir = path.join(__dirname, '..', '_site', 'og');
// Standard OG image dimensions
const ogImageWidth = 1200;
const ogImageHeight = 630;

// --- Helper function to slugify strings for filenames ---
function createSlug(text) {
  if (!text) return 'default-og-image';
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[#,&,+()$~%.'":*?<>{}]/g
  });
}

// --- Main function to generate OG images ---
async function generateOgImages() {
  console.log('Starting OG image generation...');

  // 1. Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }

  // 2. Configure Nunjucks to load the template
  //    The base path for Nunjucks is set to the directory containing the template.
  const env = njk.configure(path.dirname(templatePath), {
    autoescape: true // Enable autoescaping (good practice)
  });

  // 3. Read post files
  const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  if (postFiles.length === 0) {
    console.log('No Markdown posts found in content/posts. Skipping OG image generation.');
    return;
  }
  console.log(`Found ${postFiles.length} post(s).`);

  // 4. Launch Puppeteer browser
  //    For GitHub Actions, specific args might be needed for headless environments.
  //    We'll address this later if issues arise in CI (Step 66).
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Common args for CI environments
  });
  const page = await browser.newPage();
  await page.setViewport({ width: ogImageWidth, height: ogImageHeight });

  // 5. Loop through each post and generate an image
  for (const postFile of postFiles) {
    const filePath = path.join(postsDir, postFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContent); // Get frontmatter

    if (!frontmatter.title) {
      console.warn(`Skipping OG image for ${postFile} due to missing title in frontmatter.`);
      continue;
    }

    const postTitle = frontmatter.title;
    const slug = createSlug(postTitle); // Or use a slug from frontmatter if available
    const outputPath = path.join(outputDir, `${slug}.png`);

    console.log(`Generating OG image for: "${postTitle}" -> ${slug}.png`);

    // Render the HTML template with the post title
    const htmlContent = env.render(path.basename(templatePath), { title: postTitle });

    // Set the page content to our rendered HTML
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // waitUntil helps ensure fonts/images load

    // Take a screenshot
    try {
      await page.screenshot({ path: outputPath, type: 'png' });
      console.log(`  Successfully saved: ${outputPath}`);
    } catch (error) {
      console.error(`  Error taking screenshot for "${postTitle}":`, error);
    }
  }

  // 6. Close the browser
  await browser.close();
  console.log('OG image generation complete! 🎉');
}

// --- Run the generation process ---
generateOgImages().catch(error => {
  console.error('Error during OG image generation process:', error);
  process.exit(1); // Exit with error code if the process fails
});