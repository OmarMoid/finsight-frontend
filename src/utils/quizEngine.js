// Quiz engine — turns a static question bank into a fresh attempt each time.
//
// Three things make a retake feel genuinely new rather than reshuffled:
//   1. A subset is drawn from a pool larger than the attempt size.
//   2. Options are shuffled, so the correct letter moves between attempts.
//   3. Questions seen in recent attempts are held back until the pool is
//      exhausted — without this, drawing 8 from a pool of 15 still repeated
//      roughly half the questions every time by chance.

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export function shuffle(arr) {
  const r = [...arr]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

// Questions have no ids, so identity is the question text.
const keyOf = (q) => q?.question || ''

/**
 * Build one attempt.
 *
 * @param bank    the full question pool for the topic
 * @param count   how many questions the attempt should contain
 * @param seen    keys of questions already served in recent attempts
 * @returns       { questions, servedKeys } — pass servedKeys back in as `seen`
 *                on the next call to keep rotating through the pool.
 */
export function buildQuizAttempt(bank, count = 5, seen = []) {
  if (!Array.isArray(bank) || bank.length === 0) {
    return { questions: [], servedKeys: [] }
  }
  const n = Math.min(count, bank.length)
  const seenSet = new Set(seen)

  // Prefer unseen questions; top up from the seen pile only if there aren't
  // enough left, and reset the rotation once the whole pool has been served.
  const unseen = shuffle(bank.filter((q) => !seenSet.has(keyOf(q))))
  const previously = shuffle(bank.filter((q) => seenSet.has(keyOf(q))))
  const picked = [...unseen, ...previously].slice(0, n)

  const questions = shuffle(picked).map((q) => {
    const correctIndex = LETTERS.indexOf(q.correct)
    const tagged = q.options.map((text, i) => ({ text, correct: i === correctIndex }))
    return {
      question: q.question,
      explanation: q.explanation,
      options: shuffle(tagged),
    }
  })

  // Carry forward the questions served so far. Once every question in the pool
  // has been seen, start a fresh cycle rather than growing the list forever.
  const served = [...seen, ...picked.map(keyOf)]
  const uniqueServed = [...new Set(served)]
  const servedKeys = uniqueServed.length >= bank.length ? picked.map(keyOf) : uniqueServed

  return { questions, servedKeys }
}

// Score an attempt. `answers` maps question index -> chosen option index.
export function gradeAttempt(attempt, answers) {
  let score = 0
  attempt.forEach((q, qi) => {
    const chosen = answers[qi]
    if (chosen != null && q.options[chosen]?.correct) score += 1
  })
  return score
}

// How many questions an attempt should contain for a given pool size. Scaled
// so a bigger pool produces a longer quiz without ever asking for more
// questions than exist.
export function attemptSize(poolLength) {
  if (poolLength >= 20) return 12
  if (poolLength >= 14) return 10
  if (poolLength >= 8) return 8
  if (poolLength >= 5) return 5
  return poolLength
}
