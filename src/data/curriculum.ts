import { GRADES, SUBJECT_IDS, type Grade, type SubjectId } from './content'

export type TopicIcon =
  | 'count'
  | 'shapes'
  | 'pattern'
  | 'plus'
  | 'minus'
  | 'place'
  | 'clock'
  | 'times'
  | 'divide'
  | 'fraction'
  | 'order'
  | 'equation'
  | 'function'
  | 'chart'
  | 'phonics'
  | 'book'
  | 'article'
  | 'poem'
  | 'pencil'
  | 'grammar'
  | 'words'
  | 'speech'
  | 'map'
  | 'pin'
  | 'globe'
  | 'compass'
  | 'land'
  | 'city'
  | 'senses'
  | 'leaf'
  | 'flask'
  | 'atom'
  | 'bolt'
  | 'sun'
  | 'body'
  | 'people'
  | 'scroll'
  | 'columns'
  | 'ship'
  | 'flag'

export type Topic = {
  id: string
  name: string
  description: string
  grade: Grade
  subjectId: SubjectId
  icon: TopicIcon
}

function topic(
  subjectId: SubjectId,
  grade: Grade,
  slug: string,
  name: string,
  description: string,
  icon: TopicIcon,
): Topic {
  return {
    id: `${subjectId}-${grade.toLowerCase()}-${slug}`,
    name,
    description,
    grade,
    subjectId,
    icon,
  }
}

const topics: readonly Topic[] = [
  topic('math', 'K', 'counting', 'Counting', 'Count objects up to 20.', 'count'),
  topic('math', 'K', 'shapes', 'Shapes', 'Name circles, squares, and triangles.', 'shapes'),
  topic('math', 'K', 'comparing', 'Comparing numbers', 'Tell which group has more.', 'chart'),
  topic('math', 'K', 'patterns', 'Patterns', 'Copy a pattern and say what comes next.', 'pattern'),

  topic('math', '1', 'addition-20', 'Addition to 20', 'Add numbers within 20.', 'plus'),
  topic('math', '1', 'subtraction-20', 'Subtraction to 20', 'Subtract numbers within 20.', 'minus'),
  topic('math', '1', 'tens-ones', 'Tens and ones', 'Build numbers with tens and ones.', 'place'),
  topic('math', '1', 'length', 'Measuring length', 'Compare length with everyday units.', 'clock'),

  topic('math', '2', 'addition', 'Addition', 'Add two-digit numbers.', 'plus'),
  topic('math', '2', 'subtraction', 'Subtraction', 'Subtract two-digit numbers.', 'minus'),
  topic('math', '2', 'hundreds', 'Hundreds', 'Read and write numbers to 1,000.', 'place'),
  topic('math', '2', 'time-money', 'Time and money', 'Tell time and count coins.', 'clock'),

  topic('math', '3', 'multiplication', 'Multiplication', 'Multiply one-digit numbers.', 'times'),
  topic('math', '3', 'division', 'Division', 'Share a set into equal groups.', 'divide'),
  topic('math', '3', 'equal-parts', 'Equal parts', 'Name halves, thirds, and fourths of a shape.', 'fraction'),
  topic('math', '3', 'area', 'Area', 'Find the area of a rectangle.', 'shapes'),

  topic('math', '4', 'larger-multiplication', 'Larger multiplication', 'Multiply by two-digit numbers.', 'times'),
  topic('math', '4', 'remainders', 'Remainders', 'Divide and interpret a remainder.', 'divide'),
  topic('math', '4', 'equivalent-fractions', 'Equivalent fractions', 'Find fractions that name the same amount.', 'fraction'),
  topic('math', '4', 'decimals', 'Decimals', 'Read tenths and hundredths.', 'place'),

  topic('math', '5', 'fractions', 'Fractions', 'Add, subtract, and compare fractions.', 'fraction'),
  topic('math', '5', 'decimal-place', 'Decimal place value', 'Use decimals in place value.', 'place'),
  topic('math', '5', 'volume', 'Volume', 'Find the volume of a rectangular prism.', 'shapes'),
  topic('math', '5', 'order', 'Order of operations', 'Solve expressions in the right order.', 'order'),

  topic('math', '6', 'ratios', 'Ratios', 'Compare two amounts with a ratio.', 'fraction'),
  topic('math', '6', 'percents', 'Percents', 'Connect percents, fractions, and decimals.', 'chart'),
  topic('math', '6', 'integers', 'Integers', 'Place positive and negative numbers on a line.', 'order'),
  topic('math', '6', 'expressions', 'Expressions', 'Write expressions with variables.', 'equation'),

  topic('math', '7', 'proportions', 'Proportions', 'Solve problems with proportional relationships.', 'fraction'),
  topic('math', '7', 'rational', 'Rational numbers', 'Add and multiply rational numbers.', 'order'),
  topic('math', '7', 'equations', 'One-step equations', 'Solve an equation in one step.', 'equation'),
  topic('math', '7', 'probability', 'Probability', 'Describe how likely an event is.', 'chart'),

  topic('math', '8', 'linear-equations', 'Linear Equations', 'Graph and solve linear equations.', 'equation'),
  topic('math', '8', 'functions', 'Functions', 'Read a function as an input and an output.', 'function'),
  topic('math', '8', 'right-triangles', 'Right triangles', 'Use the Pythagorean theorem.', 'shapes'),
  topic('math', '8', 'systems', 'Systems of equations', 'Find a solution shared by two lines.', 'function'),

  topic('math', '9', 'slope', 'Slope', 'Find and interpret the slope of a line.', 'function'),
  topic('math', '9', 'exponents', 'Exponents', 'Simplify expressions with exponents.', 'times'),
  topic('math', '9', 'congruence', 'Congruence', 'Decide when figures are congruent.', 'shapes'),
  topic('math', '9', 'inequalities', 'Inequalities', 'Solve and graph linear inequalities.', 'equation'),

  topic('math', '10', 'quadratics', 'Quadratics', 'Graph and solve quadratic equations.', 'function'),
  topic('math', '10', 'factoring', 'Factoring', 'Factor quadratic expressions.', 'order'),
  topic('math', '10', 'exponential', 'Exponential growth', 'Model growth with exponential functions.', 'chart'),
  topic('math', '10', 'distance', 'Distance in the plane', 'Use coordinates to measure distance.', 'shapes'),

  topic('math', '11', 'polynomials', 'Polynomials', 'Add, multiply, and factor polynomials.', 'order'),
  topic('math', '11', 'trigonometry', 'Trigonometry', 'Use sine, cosine, and tangent in right triangles.', 'shapes'),
  topic('math', '11', 'sequences', 'Sequences', 'Describe arithmetic and geometric sequences.', 'pattern'),
  topic('math', '11', 'data', 'Data and spread', 'Interpret mean and spread in a data set.', 'chart'),

  topic('math', '12', 'calculus', 'Calculus Basics', 'See how change and accumulation connect.', 'function'),
  topic('math', '12', 'limits', 'Limits', 'Describe what a function approaches.', 'function'),
  topic('math', '12', 'derivatives', 'Derivatives', 'Measure an instantaneous rate of change.', 'chart'),
  topic('math', '12', 'integrals', 'Integrals', 'Accumulate area under a curve.', 'chart'),

  topic('english', 'K', 'phonics', 'Phonics', 'Match letters with the sounds they make.', 'phonics'),
  topic('english', 'K', 'story-time', 'Story time', 'Listen to a story and talk about it.', 'book'),
  topic('english', 'K', 'talking', 'Talking together', 'Share an idea in a full sentence.', 'speech'),
  topic('english', 'K', 'letters', 'Letters', 'Write the letters of your name.', 'pencil'),

  topic('english', '1', 'phonics', 'Phonics', 'Blend sounds to read short words.', 'phonics'),
  topic('english', '1', 'fiction', 'Fiction', 'Read a short made-up story.', 'book'),
  topic('english', '1', 'sentences', 'Sentences', 'Write a sentence that tells one idea.', 'pencil'),
  topic('english', '1', 'spelling', 'Spelling', 'Spell common short words.', 'words'),
  topic('english', '1', 'vocabulary', 'Vocabulary', 'Learn new words from a story.', 'words'),

  topic('english', '2', 'phonics', 'Phonics', 'Use long-vowel patterns to read.', 'phonics'),
  topic('english', '2', 'nonfiction', 'Nonfiction', 'Read a short text that teaches a fact.', 'article'),
  topic('english', '2', 'sentences', 'Sentences', 'Write sentences with describing words.', 'pencil'),
  topic('english', '2', 'spelling', 'Spelling', 'Spell words with common patterns.', 'words'),
  topic('english', '2', 'vocabulary', 'Vocabulary', 'Use new words when you speak.', 'words'),

  topic('english', '3', 'comprehension', 'Reading comprehension', 'Answer questions about what you read.', 'book'),
  topic('english', '3', 'fiction', 'Fiction', 'Follow the beginning, middle, and end.', 'book'),
  topic('english', '3', 'paragraphs', 'Paragraphs', 'Group sentences into a paragraph.', 'pencil'),
  topic('english', '3', 'grammar', 'Grammar', 'Use nouns, verbs, and complete sentences.', 'grammar'),
  topic('english', '3', 'spelling', 'Spelling', 'Spell grade-level words in your writing.', 'words'),

  topic('english', '4', 'nonfiction', 'Nonfiction', 'Find the main idea and supporting facts.', 'article'),
  topic('english', '4', 'narrative', 'Narrative writing', 'Write a story with a clear event.', 'pencil'),
  topic('english', '4', 'grammar', 'Grammar', 'Use verb tense and subject-verb agreement.', 'grammar'),
  topic('english', '4', 'vocabulary', 'Vocabulary', 'Use context to figure out a word.', 'words'),
  topic('english', '4', 'spelling', 'Spelling', 'Spell longer words by their parts.', 'words'),

  topic('english', '5', 'poetry', 'Poetry', 'Notice rhythm, image, and line breaks.', 'poem'),
  topic('english', '5', 'comprehension', 'Reading comprehension', 'Summarize a passage in your own words.', 'book'),
  topic('english', '5', 'narrative', 'Narrative writing', 'Write a narrative with dialogue.', 'pencil'),
  topic('english', '5', 'grammar', 'Grammar', 'Combine sentences and use commas.', 'grammar'),
  topic('english', '5', 'vocabulary', 'Vocabulary', 'Learn word roots and affixes.', 'words'),

  topic('english', '6', 'fiction', 'Fiction', 'Track how a character changes.', 'book'),
  topic('english', '6', 'nonfiction', 'Nonfiction', 'Compare two informational texts.', 'article'),
  topic('english', '6', 'persuasive', 'Persuasive writing', 'Write a claim and support it.', 'pencil'),
  topic('english', '6', 'grammar', 'Grammar', 'Use pronouns and punctuation clearly.', 'grammar'),
  topic('english', '6', 'vocabulary', 'Vocabulary', 'Choose precise words for your meaning.', 'words'),

  topic('english', '7', 'poetry', 'Poetry', 'Read a poem for tone and speaker.', 'poem'),
  topic('english', '7', 'comprehension', 'Reading comprehension', 'Cite evidence for an inference.', 'book'),
  topic('english', '7', 'persuasive', 'Persuasive writing', 'Answer a counterargument in a paragraph.', 'pencil'),
  topic('english', '7', 'grammar', 'Grammar', 'Vary sentence structure on purpose.', 'grammar'),
  topic('english', '7', 'vocabulary', 'Vocabulary', 'Distinguish denotation and connotation.', 'words'),

  topic('english', '8', 'analysis', 'Literary analysis', 'Explain how a literary device shapes meaning.', 'book'),
  topic('english', '8', 'research', 'Research essays', 'Write a short essay from sources.', 'article'),
  topic('english', '8', 'nonfiction', 'Nonfiction', 'Evaluate an author’s purpose and evidence.', 'article'),
  topic('english', '8', 'grammar', 'Grammar', 'Edit for clarity, agreement, and punctuation.', 'grammar'),
  topic('english', '8', 'vocabulary', 'Vocabulary', 'Use academic vocabulary in writing.', 'words'),

  topic('english', '9', 'fiction', 'Fiction', 'Read a novel and discuss its choices.', 'book'),
  topic('english', '9', 'poetry', 'Poetry', 'Analyze form, image, and theme in a poem.', 'poem'),
  topic('english', '9', 'analysis', 'Literary analysis', 'Write a thesis about a text.', 'pencil'),
  topic('english', '9', 'research', 'Research essays', 'Integrate quoted evidence into an essay.', 'article'),
  topic('english', '9', 'vocabulary', 'Vocabulary', 'Build vocabulary for literary discussion.', 'words'),

  topic('english', '10', 'nonfiction', 'Nonfiction', 'Read arguments and trace their reasoning.', 'article'),
  topic('english', '10', 'analysis', 'Literary analysis', 'Compare how two texts treat a theme.', 'book'),
  topic('english', '10', 'persuasive', 'Persuasive writing', 'Write a sustained argumentative essay.', 'pencil'),
  topic('english', '10', 'speaking', 'Public speaking', 'Deliver a short speech with a clear point.', 'speech'),
  topic('english', '10', 'vocabulary', 'Vocabulary', 'Use precise language for tone and claim.', 'words'),

  topic('english', '11', 'analysis', 'Literary analysis', 'Analyze a text in its historical moment.', 'book'),
  topic('english', '11', 'research', 'Research essays', 'Synthesize several sources in one essay.', 'article'),
  topic('english', '11', 'speaking', 'Public speaking', 'Present research to an audience.', 'speech'),
  topic('english', '11', 'rhetoric', 'Rhetoric', 'Identify appeal, purpose, and audience.', 'speech'),

  topic('english', '12', 'analysis', 'Literary analysis', 'Sustain an interpretation across a longer work.', 'book'),
  topic('english', '12', 'modern', 'Modern literature', 'Read contemporary fiction and argue a reading.', 'book'),
  topic('english', '12', 'research', 'Research essays', 'Write a researched argument with a works cited.', 'article'),
  topic('english', '12', 'speaking', 'Public speaking', 'Lead a discussion and respond to questions.', 'speech'),

  topic('geography', 'K', 'neighborhood', 'Maps and My Neighborhood', 'Read a simple map of places near you.', 'map'),
  topic('geography', 'K', 'land-water', 'Land and water', 'Tell land apart from water.', 'land'),
  topic('geography', 'K', 'weather', 'Weather where I live', 'Notice the weather in your neighborhood.', 'sun'),
  topic('geography', 'K', 'home', 'My home', 'Describe where you live.', 'pin'),

  topic('geography', '1', 'directions', 'Directions', 'Use left, right, and the compass words.', 'compass'),
  topic('geography', '1', 'community', 'My community', 'Name places people share in a town.', 'city'),
  topic('geography', '1', 'continents', 'Continents and oceans', 'Find the continents and oceans on a globe.', 'globe'),
  topic('geography', '1', 'homes', 'Homes and places', 'Compare homes in different places.', 'pin'),

  topic('geography', '2', 'globes', 'Maps and globes', 'Use a map and a globe to find places.', 'globe'),
  topic('geography', '2', 'city-country', 'City and countryside', 'Compare urban and rural places.', 'city'),
  topic('geography', '2', 'country', 'Our country', 'Locate your country on a map.', 'map'),
  topic('geography', '2', 'rivers', 'Rivers and mountains', 'Name major land and water forms.', 'land'),

  topic('geography', '3', 'map-keys', 'Map keys', 'Read symbols, colors, and a compass rose.', 'map'),
  topic('geography', '3', 'landforms', 'Landforms', 'Describe plains, hills, and coasts.', 'land'),
  topic('geography', '3', 'resources', 'Resources', 'Connect natural resources to daily life.', 'land'),
  topic('geography', '3', 'regions', 'Regions of the country', 'Compare regions inside one country.', 'map'),

  topic('geography', '4', 'lat-long', 'Latitude and longitude', 'Find a place with latitude and longitude.', 'compass'),
  topic('geography', '4', 'climate', 'Climate zones', 'Describe how climate differs by region.', 'sun'),
  topic('geography', '4', 'oceans', 'Oceans', 'Name the oceans and why they matter.', 'globe'),
  topic('geography', '4', 'region-study', 'A region study', 'Study one region’s land and people.', 'pin'),

  topic('geography', '5', 'states', 'US States and Capitals', 'Locate the states and name their capitals.', 'flag'),
  topic('geography', '5', 'physical-us', 'The physical United States', 'Map mountains, rivers, and coasts.', 'land'),
  topic('geography', '5', 'scale', 'Map scale', 'Use a scale to talk about distance.', 'map'),
  topic('geography', '5', 'american-regions', 'American regions', 'Compare the major regions of the United States.', 'map'),

  topic('geography', '6', 'western', 'The Western Hemisphere', 'Study the Americas on a world map.', 'globe'),
  topic('geography', '6', 'eastern', 'The Eastern Hemisphere', 'Study Europe, Africa, Asia, and Oceania.', 'globe'),
  topic('geography', '6', 'layers', "Earth's layers", 'Describe crust, mantle, and core.', 'land'),
  topic('geography', '6', 'rivers', 'Great rivers', 'Follow a major river from source to sea.', 'land'),

  topic('geography', '7', 'climates', 'World climates', 'Explain why climates differ around the world.', 'sun'),
  topic('geography', '7', 'population', 'Where people live', 'Read a population map.', 'city'),
  topic('geography', '7', 'culture', 'Culture regions', 'Compare how culture varies by place.', 'people'),
  topic('geography', '7', 'goods', 'How goods move', 'Trace a product from source to market.', 'ship'),

  topic('geography', '8', 'regions', 'World Regions', 'Compare major world regions.', 'globe'),
  topic('geography', '8', 'political', 'Political maps', 'Read borders, capitals, and countries.', 'map'),
  topic('geography', '8', 'globalization', 'Globalization', 'See how places are tied by trade and media.', 'globe'),
  topic('geography', '8', 'migration', 'Migration', 'Explain why people move and where they go.', 'pin'),

  topic('geography', '9', 'environment', 'People and the environment', 'Describe how people change a landscape.', 'land'),
  topic('geography', '9', 'economies', 'Economies', 'Compare how regions make a living.', 'chart'),
  topic('geography', '9', 'cities', 'Cities', 'Explain why cities grow where they do.', 'city'),
  topic('geography', '9', 'borders', 'Borders', 'Ask how borders are drawn and disputed.', 'map'),

  topic('geography', '10', 'resources', 'Resources', 'Connect resources to power and conflict.', 'land'),
  topic('geography', '10', 'urban', 'Urban life', 'Study how cities are organized.', 'city'),
  topic('geography', '10', 'development', 'Development', 'Compare indicators of human development.', 'chart'),
  topic('geography', '10', 'geopolitics', 'Geopolitics', 'Read a conflict with a map in hand.', 'globe'),

  topic('geography', '11', 'human', 'Human Geography', 'Ask how people organize space.', 'people'),
  topic('geography', '11', 'landscapes', 'Cultural landscapes', 'Read culture in the built landscape.', 'city'),
  topic('geography', '11', 'population', 'Population change', 'Interpret population pyramids and change.', 'chart'),
  topic('geography', '11', 'sustainability', 'Sustainability', 'Weigh how places use land and water.', 'leaf'),

  topic('geography', '12', 'inquiry', 'Asking geographic questions', 'Frame a geographic question and a map.', 'compass'),
  topic('geography', '12', 'today', 'The world today', 'Use current maps to discuss a world issue.', 'globe'),
  topic('geography', '12', 'climate-society', 'Climate and society', 'Connect climate change to places and people.', 'sun'),
  topic('geography', '12', 'links', 'Global links', 'Trace a global flow of people, goods, or ideas.', 'ship'),

  topic('science', 'K', 'senses', 'Five Senses', 'Use sight, hearing, smell, taste, and touch.', 'senses'),
  topic('science', 'K', 'living', 'Living and nonliving', 'Sort living things from nonliving things.', 'leaf'),
  topic('science', 'K', 'weather', 'Weather', 'Observe sun, rain, wind, and clouds.', 'sun'),
  topic('science', 'K', 'pushes', 'Pushes and pulls', 'Change motion with a push or a pull.', 'bolt'),

  topic('science', '1', 'plants', 'Plants', 'Name the parts of a plant and what they do.', 'leaf'),
  topic('science', '1', 'animals', 'Animals', 'Compare how animals move and eat.', 'leaf'),
  topic('science', '1', 'seasons', 'Seasons', 'Describe how the seasons change.', 'sun'),
  topic('science', '1', 'sky', 'The sky', 'Notice the sun, moon, and stars.', 'sun'),

  topic('science', '2', 'habitats', 'Habitats', 'Match living things to their habitats.', 'leaf'),
  topic('science', '2', 'matter', 'Solids and liquids', 'Compare solids and liquids.', 'flask'),
  topic('science', '2', 'surface', "Earth's surface", 'Describe rocks, soil, and water.', 'land'),
  topic('science', '2', 'seeds', 'From seed to plant', 'Watch how a seed grows.', 'leaf'),

  topic('science', '3', 'forces', 'Forces', 'See how forces change speed and direction.', 'bolt'),
  topic('science', '3', 'weather', 'Weather patterns', 'Track weather over days.', 'sun'),
  topic('science', '3', 'fossils', 'Fossils', 'Use fossils as clues to past life.', 'land'),
  topic('science', '3', 'food-chains', 'Food chains', 'Follow energy from plant to animal.', 'leaf'),

  topic('science', '4', 'cycles', 'Life Cycles', 'Compare the life cycles of plants and animals.', 'leaf'),
  topic('science', '4', 'energy', 'Energy', 'Find energy of motion, light, and heat.', 'bolt'),
  topic('science', '4', 'rocks', 'Rocks and soil', 'Observe properties of rocks and soil.', 'land'),
  topic('science', '4', 'solar', 'The solar system', 'Name the sun, planets, and Earth’s motion.', 'sun'),

  topic('science', '5', 'mixtures', 'Mixtures', 'Separate a mixture by its properties.', 'flask'),
  topic('science', '5', 'ecosystems', 'Ecosystems', 'Describe how organisms interact.', 'leaf'),
  topic('science', '5', 'earth-systems', "Earth's systems", 'Connect air, water, rock, and life.', 'globe'),
  topic('science', '5', 'body', 'The human body', 'Name major body systems and their jobs.', 'body'),

  topic('science', '6', 'classifying', 'Classifying life', 'Sort organisms into broad groups.', 'leaf'),
  topic('science', '6', 'energy-flow', 'Energy in ecosystems', 'Trace energy through a food web.', 'bolt'),
  topic('science', '6', 'plates', 'Moving plates', 'Explain earthquakes and volcanoes.', 'land'),
  topic('science', '6', 'climate', 'Weather and climate', 'Tell weather apart from climate.', 'sun'),

  topic('science', '7', 'cells', 'Cells', 'Identify the parts of plant and animal cells.', 'atom'),
  topic('science', '7', 'body', 'Body systems', 'Explain how body systems work together.', 'body'),
  topic('science', '7', 'traits', 'Traits', 'See how traits pass from parent to offspring.', 'leaf'),
  topic('science', '7', 'interdependent', 'Interdependent life', 'Model relationships in an ecosystem.', 'leaf'),

  topic('science', '8', 'chemical', 'Chemical changes', 'Tell a chemical change from a physical one.', 'flask'),
  topic('science', '8', 'motion', 'Motion', 'Describe speed, velocity, and acceleration.', 'bolt'),
  topic('science', '8', 'earth-history', "Earth's history", 'Read evidence for Earth’s long history.', 'land'),
  topic('science', '8', 'waves', 'Waves', 'Compare sound and light waves.', 'bolt'),

  topic('science', '9', 'chemistry', 'Chemistry Basics', 'Describe atoms, elements, and compounds.', 'flask'),
  topic('science', '9', 'atoms', 'Atoms', 'Model protons, neutrons, and electrons.', 'atom'),
  topic('science', '9', 'living-systems', 'Living systems', 'Connect cells, tissues, and organs.', 'body'),
  topic('science', '9', 'earth', 'Earth science', 'Explain plate motion and the rock cycle.', 'land'),

  topic('science', '10', 'bonding', 'Chemical bonding', 'Compare ionic and covalent bonds.', 'flask'),
  topic('science', '10', 'genetics', 'Genetics', 'Use a simple model of inheritance.', 'atom'),
  topic('science', '10', 'evolution', 'Evolution', 'Explain change in populations over time.', 'leaf'),
  topic('science', '10', 'energy', 'Forms of energy', 'Track energy as it transforms.', 'bolt'),

  topic('science', '11', 'physics', 'Physics', 'Study motion, force, and energy together.', 'atom'),
  topic('science', '11', 'forces', 'Forces and motion', 'Apply Newton’s laws to a situation.', 'bolt'),
  topic('science', '11', 'electricity', 'Electricity', 'Describe current, voltage, and circuits.', 'bolt'),
  topic('science', '11', 'light', 'Light and sound', 'Model reflection, refraction, and pitch.', 'sun'),

  topic('science', '12', 'applied-physics', 'Using physics', 'Apply physics to a real device or motion.', 'bolt'),
  topic('science', '12', 'environment', 'Environmental science', 'Evaluate a human impact on a system.', 'leaf'),
  topic('science', '12', 'models', 'Models in science', 'Judge what a scientific model explains.', 'function'),
  topic('science', '12', 'carbon', 'Carbon compounds', 'Recognize carbon in the molecules of life.', 'flask'),

  topic('history', 'K', 'helpers', 'Community Helpers', 'Meet people who help a community.', 'people'),
  topic('history', 'K', 'family', 'Family stories', 'Tell a story from your family.', 'scroll'),
  topic('history', 'K', 'then-now', 'Then and now', 'Compare life now with life long ago.', 'clock'),
  topic('history', 'K', 'rules', 'Rules and fairness', 'Talk about rules that help people.', 'flag'),

  topic('history', '1', 'school', 'School in the past', 'Compare school long ago with school today.', 'people'),
  topic('history', '1', 'symbols', 'Symbols of the country', 'Learn what familiar symbols stand for.', 'flag'),
  topic('history', '1', 'helpers', 'People who help', 'Ask how helpers have changed over time.', 'people'),
  topic('history', '1', 'stories', 'Stories from long ago', 'Listen to a story about the past.', 'scroll'),

  topic('history', '2', 'timelines', 'Timelines', 'Place events in order on a timeline.', 'clock'),
  topic('history', '2', 'first-peoples', 'First peoples', 'Learn how Native communities lived here.', 'people'),
  topic('history', '2', 'landmarks', 'Landmarks', 'Find a landmark and the story it holds.', 'columns'),
  topic('history', '2', 'towns', 'How towns change', 'See how a town grows and changes.', 'city'),

  topic('history', '3', 'communities', 'Early communities', 'Compare communities in different times.', 'people'),
  topic('history', '3', 'inventors', 'Inventors', 'Meet an inventor and the problem they solved.', 'bolt'),
  topic('history', '3', 'leaders', 'Local leaders', 'Learn who makes decisions close to home.', 'flag'),
  topic('history', '3', 'traditions', 'Traditions', 'Trace a tradition through time.', 'scroll'),

  topic('history', '4', 'early-america', 'Early American History', 'Study the peoples and colonies of early America.', 'flag'),
  topic('history', '4', 'colonial', 'Colonial life', 'Describe daily life in the colonies.', 'people'),
  topic('history', '4', 'state', "Our state's story", 'Tell a story from your state’s past.', 'map'),
  topic('history', '4', 'growing', 'A growing nation', 'Follow how the country added land and people.', 'map'),

  topic('history', '5', 'exploration', 'Age of Exploration', 'Ask why explorers sailed and what followed.', 'ship'),
  topic('history', '5', 'revolution', 'American Revolution', 'Explain why the colonies broke from Britain.', 'flag'),
  topic('history', '5', 'constitution', 'The Constitution', 'Describe how the Constitution organizes government.', 'scroll'),
  topic('history', '5', 'west', 'Moving west', 'Study westward movement and its costs.', 'map'),

  topic('history', '6', 'mesopotamia', 'Mesopotamia', 'Study cities, writing, and law in Mesopotamia.', 'scroll'),
  topic('history', '6', 'egypt', 'Egypt', 'Study the Nile, pharaohs, and belief in Egypt.', 'columns'),
  topic('history', '6', 'china', 'China', 'Study early Chinese dynasties and ideas.', 'scroll'),
  topic('history', '6', 'indus', 'The Indus Valley', 'Look at planned cities of the Indus Valley.', 'city'),

  topic('history', '7', 'greece', 'Greece', 'Study Greek city-states, myth, and democracy.', 'columns'),
  topic('history', '7', 'rome', 'Rome', 'Follow Rome from republic to empire.', 'columns'),
  topic('history', '7', 'maya', 'Maya', 'Study Maya cities, writing, and astronomy.', 'sun'),
  topic('history', '7', 'medieval', 'Medieval Times', 'Describe feudal life, faith, and towns.', 'columns'),

  topic('history', '8', 'civil-war', 'Civil War', 'Explain the causes and course of the Civil War.', 'flag'),
  topic('history', '8', 'reconstruction', 'Reconstruction', 'Ask what Reconstruction changed and what it did not.', 'flag'),
  topic('history', '8', 'factories', 'Factories', 'See how industry changed work and cities.', 'city'),
  topic('history', '8', 'newcomers', 'Newcomers', 'Study immigration at the turn of the century.', 'ship'),

  topic('history', '9', 'world-wars', 'World Wars', 'Compare the causes and consequences of the world wars.', 'flag'),
  topic('history', '9', 'between', 'Between the wars', 'Study the years between the world wars.', 'scroll'),
  topic('history', '9', 'nations', 'New nations', 'Follow independence movements in the twentieth century.', 'globe'),
  topic('history', '9', 'connected', 'A connected world', 'See how technology tied distant places together.', 'globe'),

  topic('history', '10', 'cold-war', 'Cold War', 'Explain the Cold War without a single battlefield.', 'globe'),
  topic('history', '10', 'civil-rights', 'Civil rights', 'Study the fight to make rights real.', 'people'),
  topic('history', '10', 'independence', 'Independence movements', 'Compare struggles to end colonial rule.', 'flag'),
  topic('history', '10', 'space', 'Into space', 'Place the space age in Cold War history.', 'sun'),

  topic('history', '11', 'modern', 'Modern History', 'Interpret major changes since the mid-twentieth century.', 'globe'),
  topic('history', '11', 'economy', 'A global economy', 'Ask who gained and who lost as trade grew.', 'chart'),
  topic('history', '11', 'rights', 'Rights movements', 'Compare movements for rights around the world.', 'people'),
  topic('history', '11', 'late-century', 'The late twentieth century', 'Connect the end of the Cold War to daily life.', 'clock'),

  topic('history', '12', 'since-2000', 'Since 2000', 'Place recent events in a longer history.', 'globe'),
  topic('history', '12', 'historians', 'How historians work', 'Use evidence, context, and argument.', 'scroll'),
  topic('history', '12', 'challenges', 'Global challenges', 'Study a present challenge with historical context.', 'globe'),
  topic('history', '12', 'memory', 'Media and memory', 'Ask how media shapes what societies remember.', 'speech'),
]

function assertCurriculum(items: readonly Topic[]): void {
  const ids = new Set<string>()
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`Duplicate topic id ${item.id}`)
    ids.add(item.id)
    if (!item.name.trim() || !item.description.trim()) throw new Error(`Topic ${item.id} is missing text`)
  }
  for (const subjectId of SUBJECT_IDS) {
    for (const grade of GRADES) {
      const count = items.filter((item) => item.subjectId === subjectId && item.grade === grade).length
      if (count < 3 || count > 6) throw new Error(`${subjectId} grade ${grade} has ${count} topics`)
    }
  }
  const placed: Array<[SubjectId, Grade, string]> = [
    ['math', 'K', 'Counting'],
    ['math', 'K', 'Shapes'],
    ['math', '2', 'Addition'],
    ['math', '2', 'Subtraction'],
    ['math', '5', 'Fractions'],
    ['math', '8', 'Linear Equations'],
    ['math', '10', 'Quadratics'],
    ['math', '12', 'Calculus Basics'],
    ['geography', 'K', 'Maps and My Neighborhood'],
    ['geography', '5', 'US States and Capitals'],
    ['geography', '8', 'World Regions'],
    ['geography', '11', 'Human Geography'],
    ['science', 'K', 'Five Senses'],
    ['science', '4', 'Life Cycles'],
    ['science', '7', 'Cells'],
    ['science', '9', 'Chemistry Basics'],
    ['science', '11', 'Physics'],
    ['history', 'K', 'Community Helpers'],
    ['history', '4', 'Early American History'],
    ['history', '5', 'Age of Exploration'],
    ['history', '5', 'American Revolution'],
    ['history', '6', 'Mesopotamia'],
    ['history', '6', 'Egypt'],
    ['history', '6', 'China'],
    ['history', '7', 'Greece'],
    ['history', '7', 'Rome'],
    ['history', '7', 'Maya'],
    ['history', '7', 'Medieval Times'],
    ['history', '8', 'Civil War'],
    ['history', '9', 'World Wars'],
    ['history', '10', 'Cold War'],
    ['history', '11', 'Modern History'],
  ]
  for (const [subjectId, grade, name] of placed) {
    const found = items.some((item) => item.subjectId === subjectId && item.grade === grade && item.name === name)
    if (!found) throw new Error(`Missing ${subjectId} grade ${grade}: ${name}`)
  }
  const english = [
    'Phonics',
    'Reading comprehension',
    'Fiction',
    'Nonfiction',
    'Poetry',
    'Sentences',
    'Paragraphs',
    'Narrative writing',
    'Persuasive writing',
    'Research essays',
    'Grammar',
    'Vocabulary',
    'Spelling',
    'Literary analysis',
    'Public speaking',
  ]
  for (const name of english) {
    if (!items.some((item) => item.subjectId === 'english' && item.name === name)) {
      throw new Error(`Missing English topic ${name}`)
    }
  }
  const early = new Set<Grade>(['K', '1', '2'])
  const upper = new Set<Grade>(['8', '9', '10', '11', '12'])
  for (const item of items) {
    if (item.name === 'Phonics' && !early.has(item.grade)) throw new Error('Phonics is only for early grades')
    if (item.name === 'Literary analysis' && !upper.has(item.grade)) {
      throw new Error('Literary analysis is only for upper grades')
    }
  }
}

assertCurriculum(topics)

const byId = new Map(topics.map((item) => [item.id, item]))

export function getTopics(subjectId: SubjectId, grade?: Grade): readonly Topic[] {
  return topics.filter((item) => item.subjectId === subjectId && (grade === undefined || item.grade === grade))
}

export function getTopic(id: string): Topic | undefined {
  return byId.get(id)
}

export function topicCount(): number {
  return topics.length
}
