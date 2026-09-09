# client/game

Application/session composition. Own LocalSession and OnlineSession selection; consume shared simulation. Do not duplicate game rules.

M1 implemented: `local-session.ts` owns the fixed clock and previous/current state; `main.ts` composes browser controls, view and UI. OnlineSession is the next M2 increment. See HANDOFF.md and current STATUS.md.
