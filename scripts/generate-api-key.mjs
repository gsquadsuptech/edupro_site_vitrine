#!/usr/bin/env node
/**
 * Génère une clé `MARKETPLACE_API_KEY` cryptographiquement sûre.
 *
 * La clé est un simple secret partagé : la vitrine l'envoie en en-tête
 * `x-api-key` et le SaaS la compare à son propre `MARKETPLACE_API_KEY`.
 * Le format est donc libre ; on produit un préfixe lisible + 32 octets
 * aléatoires en base64url (≈ 43 caractères, sans `+`/`/`/`=` gênants en .env).
 *
 * Usage :
 *   node scripts/generate-api-key.mjs            # affiche MARKETPLACE_API_KEY=<clé>
 *   node scripts/generate-api-key.mjs --raw      # affiche seulement la clé
 *   node scripts/generate-api-key.mjs --bytes 48 # change l'entropie (défaut 32)
 *   node scripts/generate-api-key.mjs --prefix "" # sans préfixe
 */

import { randomBytes } from "node:crypto"

function parseArgs(argv) {
    const opts = { raw: false, bytes: 32, prefix: "mk_" }
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i]
        if (arg === "--raw") opts.raw = true
        else if (arg === "--bytes") opts.bytes = Number(argv[++i])
        else if (arg === "--prefix") opts.prefix = argv[++i] ?? ""
        else if (arg === "--help" || arg === "-h") opts.help = true
        else {
            console.error(`Option inconnue : ${arg}`)
            process.exit(1)
        }
    }
    return opts
}

const opts = parseArgs(process.argv.slice(2))

if (opts.help) {
    console.log(
        [
            "Génère une clé MARKETPLACE_API_KEY.",
            "",
            "Options :",
            "  --raw           Affiche uniquement la clé (sans MARKETPLACE_API_KEY=)",
            "  --bytes <n>     Nombre d'octets d'entropie (défaut 32)",
            '  --prefix <str>  Préfixe lisible (défaut "mk_", "" pour aucun)',
            "  -h, --help      Affiche cette aide",
        ].join("\n"),
    )
    process.exit(0)
}

if (!Number.isInteger(opts.bytes) || opts.bytes < 16) {
    console.error("--bytes doit être un entier >= 16 (entropie minimale).")
    process.exit(1)
}

const secret = randomBytes(opts.bytes).toString("base64url")
const key = `${opts.prefix}${secret}`

console.log(opts.raw ? key : `MARKETPLACE_API_KEY=${key}`)
