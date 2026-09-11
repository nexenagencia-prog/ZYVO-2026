# ZYVO Behavioral Meeting Analysis — Design

Date: 2026-09-11
Status: Approved in conversation; awaiting review of this written specification
Branch: `dev`

## Purpose

Turn ZYVO meeting analysis into an evidence-based behavioral coaching experience. The system must explain not only what was said, but how observable communication behavior influenced the conversation. It must avoid psychological diagnosis and must distinguish evidence from inference.

This first version uses structured simulated transcripts. A future real transcription provider will replace only the transcript source, without changing the analysis engine or user interface contracts.

## Scope

- Unify `Skills → Ver análise completa` and `Gravações → Analisar` behind one analysis workspace.
- Preserve the approved light-blue analysis palette currently visible from Skills.
- Analyze simulated transcript data with a deterministic, testable behavioral engine.
- Suggest a meeting objective and let the user confirm or change it.
- Support General, Sales, Leadership, Negotiation, Interview, Presentation, and Customer Service objectives.
- Make metric cards, evidence moments, coaching questions, comparisons, and reports functional.
- Keep the selected recording and recording-to-recording navigation working.
- Prepare a transcript adapter contract for a future real transcription source.

## Non-goals

- No deployment and no changes to `main`.
- No audio transcription provider or external AI provider in this version.
- No clinical, personality, mental-health, emotion, or psychological diagnosis.
- No claim about hidden intent. Inferences must be labeled and tied to observable evidence.
- The pending Space notes “+” change is outside this specification.

## Existing problem and root cause

The application currently contains two implementations of the same analysis experience:

- Skills renders an embedded `AnalysisView` and receives its approved blue visual layer from `skills-fix.css`.
- Recordings navigates to `/analise-reunioes`, which renders `AnalysisPageClient` and loads only the older green `analysis.css` theme.

Runtime inspection confirmed the mismatch. The Skills flow uses blue glass panels and a white/blue score ring, while the Recordings route uses a green score ring and the older white/green background.

The fix is structural: both entry points must render the same analysis workspace and canonical theme instead of synchronizing two copies manually.

## Architecture

### Shared analysis workspace

A single `AnalysisWorkspace` component will own presentation and interaction. It receives the selected recording, available recordings, navigation callback, and back callback. Both Skills and `/analise-reunioes` render this component.

The canonical analysis stylesheet will live with the workspace and contain the approved light-blue palette. Skills-specific CSS must no longer be the only source of the approved theme.

### Transcript source contract

The engine receives a normalized transcript:

```ts
type TranscriptTurn = {
  id: string;
  participantId: string;
  participantName: string;
  role: 'user' | 'other';
  startMs: number;
  endMs: number;
  text: string;
  interrupted?: boolean;
  interruptionTargetId?: string;
};

type MeetingTranscript = {
  recordingId: string;
  language: 'pt-BR';
  durationMs: number;
  participants: Array<{id: string; name: string}>;
  turns: TranscriptTurn[];
  source: 'simulated' | 'transcribed';
};
```

The initial adapter returns a deterministic simulated transcript for each recording. A future adapter will map real transcription output into the same `MeetingTranscript` structure.

### Analysis engine

The engine is a pure module with no React, browser, storage, or provider dependency:

```ts
analyzeMeeting(transcript, objectiveProfile, history) => MeetingAnalysis
```

Its output includes:

- Overall score and score confidence.
- Core behavioral metrics.
- Objective-specific metrics.
- Evidence-backed moments with timestamps and transcript excerpts.
- Strengths, risks, missed opportunities, and recommended interventions.
- Recurring patterns and meeting-to-meeting trends.
- Suggested objective and the signals used for that suggestion.
- A generated report model.

Because the engine is deterministic, the same transcript and objective always produce the same result. No score is generated from a recording ID, random number, thumbnail, or star rating.

## Behavioral model

### Core dimensions

Every meeting includes:

- Communication
- Clarity
- Listening
- Objectivity
- Questions
- Argumentation
- Leadership/conversation guidance
- Persuasion

Observable signals include talk/listen ratio, turn duration, interruptions, question depth, use of the other participant’s language, repetition after confirmation, response to objections, explicit next steps, and distribution of participation.

### Objective profiles

Each profile defines metrics, weights, positive signals, risk signals, and coaching prompts.

- General: balanced core dimensions and meeting outcome clarity.
- Sales: pain, discovery questions, impact, urgency, objections, perceived value, confidence, close, and next step.
- Leadership: context, direction, psychological-safety language without diagnosis, delegation, accountability, participation, feedback, and alignment.
- Negotiation: interests, constraints, anchors, concessions, alternatives, value exchange, resistance, and agreement clarity.
- Interview: question quality, follow-up depth, candidate airtime, evidence gathering, bias-resistant structure, and decision criteria.
- Presentation: narrative, clarity, pacing, audience checks, persuasion, handling questions, and call to action.
- Customer Service: problem understanding, empathy language, ownership, clarity, resolution, expectation setting, and follow-up.

The system suggests a profile from transcript signals. The user can always confirm or override it, and the analysis recalculates immediately.

## Evidence and safety rules

Each behavioral finding must include:

- The observable signal.
- At least one transcript excerpt when available.
- Timestamp and participant attribution.
- Confidence: high, medium, or low.
- An explanation of why the signal supports the finding.
- A specific alternative behavior or question.

The engine may say “the wording suggests resistance with medium confidence.” It must not say “the participant is insecure” or infer a diagnosis, personality trait, or internal mental state as fact.

When evidence is insufficient, the result must explicitly say so and lower confidence rather than inventing certainty.

## User experience

### Header and recording context

- Keep the selected recording’s video/poster, title, metadata, participants, and navigation.
- Preserve navigation back to the correct originating screen.
- Display a small “Transcrição simulada” label during this phase.

### Objective control

- Show the suggested objective and confidence.
- Let the user confirm it or select another profile.
- Recalculate all objective-sensitive scores and recommendations after a change.

### Score and metric cards

- Use the approved blue glass palette and white/blue progress treatments.
- Every metric card is a button.
- Selecting a metric opens an in-layout detail view with score, evidence, transcript excerpt, behavioral reading, missed opportunity, recommendation, and confidence.
- The detail view includes a return control to the overview.

### Evidence moments

- Each insight is clickable.
- Clicking seeks the recording to the timestamp when playable and highlights the matching transcript turn.
- If no playable media exists, the transcript evidence still opens and is highlighted.

### Coach ZYVO

The interface includes a compact question input with suggested prompts such as:

- “O que eu poderia ter feito melhor?”
- “Onde perdi uma oportunidade?”
- “Como posso fazer perguntas melhores?”
- “Qual padrão se repete nas minhas reuniões?”

In this version, answers are generated deterministically from `MeetingAnalysis`, so every answer cites existing evidence and recommendations. The boundary is designed so a future AI answer provider can consume the same analysis model.

### Comparison and recurring patterns

The engine analyzes all available simulated transcripts to show:

- Direction of change per metric.
- Recurring strengths and risks.
- Evidence count across meetings.
- The highest-priority behavior for the next meeting.

A single meeting never claims a recurring pattern. Recurrence requires matching evidence in at least two meetings.

### Report

- Generate a complete on-screen report from the analysis model.
- Include objective, methodology note, scores, evidence, confidence, recurring patterns, and action plan.
- Keep download functional as a local text report in this phase.

## Data and persistence

- Selected recording continues using the existing recording selection contract.
- Confirmed objective is stored per recording, not globally.
- Simulated transcripts are stable fixtures keyed by recording ID.
- Analysis results are derived, not persisted as an independent source of truth.
- The transcript source field remains visible so simulated and real data cannot be confused.

## Error and empty states

- No transcript: explain that evidence-based analysis is unavailable and provide a retry/fixture fallback only in development data.
- Invalid transcript: identify the missing required structure without crashing the page.
- Insufficient evidence: show low confidence and suppress unsupported recommendations.
- Missing recording: render the default demonstration meeting and allow navigation back.
- Unplayable media: preserve transcript analysis and disable only video seeking.

## Testing strategy

Implementation follows test-driven development.

### Engine tests

- Deterministic output for the same input.
- Talk/listen ratio and interruption calculations.
- Question classification and objective signal extraction.
- Objective profile changes weights and output.
- Evidence timestamps and excerpts remain tied to source turns.
- Insufficient evidence lowers confidence.
- Recurring patterns require at least two meetings.
- Safety language prevents unsupported psychological diagnosis.
- Coach answers cite findings already present in the analysis.

### Integration tests

- Both entry points render the same analysis workspace contract.
- The selected recording is loaded from the existing flow.
- Objective override recalculates the analysis.
- Metric cards open and close their detail views.
- Insight clicks select the corresponding transcript moment.
- Report generation and download remain functional.

### Visual and build verification

- Compare computed colors and backgrounds for Skills and Recordings flows.
- Verify both paths in the local browser.
- Verify responsive layout without changing the approved desktop design.
- Run focused tests, the full suite, and the production build.

## Migration sequence

1. Add transcript, objective profile, and analysis result contracts.
2. Add simulated transcript fixtures.
3. Build the pure deterministic engine with tests.
4. Extract the canonical shared analysis workspace and approved theme.
5. Replace the embedded Skills analysis and dedicated route implementations with the shared workspace.
6. Add objective selection, metric details, evidence moments, Coach ZYVO, comparison, and report interactions.
7. Validate both navigation paths, full tests, and production build.

## Future real transcription integration

The future provider must implement a single adapter that returns `MeetingTranscript`. Provider-specific payloads, diarization labels, confidence values, and word timings remain outside the engine. After normalization, the existing behavioral engine, objective profiles, interface, comparisons, and reports continue unchanged.
