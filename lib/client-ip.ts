import { isIPv4, isIPv6 } from "net"
import type { NextRequest } from "next/server"

// IP pour la limitation de débit : X-Real-IP est ÉCRASÉ par notre nginx
// ($remote_addr, deploy/nginx/edupro.africa.conf) ; X-Forwarded-For et
// CF-Connecting-IP sont fournis par le client et donc falsifiables.
export function trustedClientIp(request: NextRequest): string {
    const ip = request.headers.get("x-real-ip")?.trim() || "unknown"
    return rateLimitIpKey(ip)
}

// IPv4 telle quelle ; IPv4 mappée (::ffff:a.b.c.d) ramenée en IPv4 ;
// IPv6 développée sur 8 groupes puis agrégée en /64 (un client dispose en
// général d'un /64 entier). Valeur non analysable → adresse brute.
export function rateLimitIpKey(ip: string): string {
    if (isIPv4(ip)) return ip
    if (!isIPv6(ip)) return ip
    const mapped = ip.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i)
    if (mapped && isIPv4(mapped[1])) return mapped[1]
    const [head, tail] = ip.split("::")
    const h = head ? head.split(":") : []
    const t = tail !== undefined && tail !== "" ? tail.split(":") : []
    if (t.some((g) => g.includes(".")) || h.some((g) => g.includes("."))) return ip
    const groups = tail === undefined ? h : [...h, ...Array(8 - h.length - t.length).fill("0"), ...t]
    if (groups.length !== 8) return ip
    const norm = groups.map((g) => parseInt(g || "0", 16).toString(16))
    return `${norm.slice(0, 4).join(":")}::/64`
}
