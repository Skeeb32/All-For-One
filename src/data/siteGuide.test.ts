import { describe, expect, it } from 'vitest'
import { answerFromSiteGuide } from './siteGuide'

describe('local website guide', () => {
  it('lists every project and states that they are route briefs', () => {
    const result = answerFromSiteGuide('What projects are included?')
    expect(result.answer).toContain('Developer Analytics Dashboard')
    expect(result.answer).toContain('Codebase Architecture Visualizer')
    expect(result.answer).toContain('Stage 1 route briefs')
  })

  it('finds project details and offers source routes', () => {
    const result = answerFromSiteGuide('Which project monitors GitHub Actions builds?')
    expect(result.answer).toContain('Pipeline Monitor')
    expect(result.sources.some((source) => source.to === '/projects/pipeline-monitor')).toBe(true)
  })

  it('does not invent an answer when site content has no match', () => {
    expect(answerFromSiteGuide('Tell me about Mars missions').answer).toContain('couldn’t find that in the site guide')
  })

  it('matches the topic rather than generic wording', () => {
    const result = answerFromSiteGuide('How does the project manage its theme?')
    expect(result.sources[0]).toMatchObject({ title: 'Settings', to: '/settings' })
    expect(result.answer).toContain('Theme preference is stored locally')
  })
})
