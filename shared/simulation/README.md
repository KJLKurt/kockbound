# shared/simulation

Pure fixed-step movement, contacts, actions, hazards and mode orchestration. No platform/render/storage imports.

M1 implemented: `index.ts` owns fixed-step physics; `arena-mode.ts` owns Arena shrink/outcomes; `bots.ts` creates normal-rule inputs. State can be serialized as JSON. See the root tests and M1 evidence before changing physics or mode contracts.
