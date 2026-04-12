# Style System — MVP

## Visual target

Minimal, calm, readable, slightly premium.

Think:

- clean spacing
- confident typography
- obvious interaction states
- quiet interface

## Visual priorities

1. readable words
2. clear selected state
3. clear solved state
4. visible mistakes remaining
5. clear submit affordance

## Card rules

Cards should:

- be large
- have generous padding
- support 1–2 lines gracefully
- have clear selected/idle/solved/disabled states

## Layout rules

### Mobile first

- single-column framing
- grid remains central focus
- controls reachable by thumb

### Desktop

- same structure, more spacing

## Typography

Use a sane system font stack or a single web font if cheap and performant.

## Color policy

Use a restrained palette:

- neutral background
- strong readable foreground
- 1 primary accent
- solved group colors only where needed

## Motion policy

Allowed:

- tiny press feedback
- subtle card state transitions
- restrained success feedback

Not allowed:

- long transitions
- motion-heavy scene changes
- confetti dependency unless trivial
