# bosses

`cloud-king.ts` contains the Cloud King and Tempest King data profiles consumed by the registered shared boss mode. Both use the same rune/core/telegraph behaviors and renderer; changing profile values does not require networking edits. See [party-mode contract](../../docs/PARTY_MODE_CONTRACT.md) for schema, scaling, acceptance and current limits.

Independent content authoring boundary. Follow docs/CONTENT_SYSTEM.md for identity, typed payload, dependencies, validation and release lifecycle. Add definitions only when their schema and registered consumer exist. No released runtime content at bootstrap.
