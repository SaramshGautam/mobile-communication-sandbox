import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

const input = process.argv[2]
const output = process.argv[3] ?? 'src/data/generatedTasks.json'
if (!input) {
  console.error('Usage: npm run convert:tasks -- tasks.csv [output.json]')
  process.exit(1)
}

const split = (value = '') => String(value).split(/[;|]/).map((item) => item.trim()).filter(Boolean)
const slug = (value = '') => String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const required = ['task_pair_id', 'intent_family', 'general_intent', 'feed_instruction', 'message_instruction']
const parsed = Papa.parse(fs.readFileSync(input, 'utf8'), { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim().toLowerCase() })
if (parsed.errors.length) throw new Error(parsed.errors.map((error) => error.message).join('\n'))

const errors = []
const taskPairs = parsed.data.map((row, index) => {
  const missing = required.filter((field) => !String(row[field] ?? '').trim())
  if (missing.length) errors.push(`Row ${index + 2}: missing ${missing.join(', ')}`)
  const pairId = row.task_pair_id?.trim() || `PAIR_${index + 1}`
  const common = {
    pairId,
    intentFamily: slug(row.intent_family),
    difficulty: slug(row.difficulty || 'unrated'),
    semanticIntent: row.general_intent?.trim(),
    breakdownTargets: split(row.breakdown_targets).map(slug),
    objects: {
      people: split(row.required_people), groups: split(row.required_groups), photos: split(row.required_photos),
      posts: split(row.required_posts), messages: split(row.required_messages), events: split(row.required_events)
    },
    groundTruth: {
      contentIds: split(row.content_ids || row.required_photos), recipientIds: split(row.recipient_ids || row.recipient_id),
      visibility: slug(row.visibility), expectedAction: slug(row.expected_action), completionState: slug(row.completion_state || 'completed')
    }
  }
  return {
    ...common,
    variants: {
      feed: { id: `${pairId}_FEED`, instruction: row.feed_instruction?.trim(), startState: slug(row.feed_start_state || 'home_feed') },
      messaging: { id: `${pairId}_MSG`, instruction: row.message_instruction?.trim(), startState: slug(row.message_start_state || 'conversation_list') }
    }
  }
})

if (errors.length) {
  console.error(`CSV validation failed:\n${errors.join('\n')}`)
  process.exit(1)
}
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, JSON.stringify({ generatedAt: new Date().toISOString(), taskPairs }, null, 2))
console.log(`Converted ${taskPairs.length} task pairs to ${output}`)
