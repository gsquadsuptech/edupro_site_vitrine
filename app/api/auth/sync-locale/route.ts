import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { routing } from "@/i18n/routing"

export const runtime = "nodejs"

const COOKIE_NAME = "NEXT_LOCALE"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

function isSupportedLocale(value: string | undefined): value is (typeof routing.locales)[number] {
    return !!value && (routing.locales as readonly string[]).includes(value)
}

export async function POST() {
    const store = await cookies()
    const current = store.get(COOKIE_NAME)?.value
    const language = isSupportedLocale(current) ? current : routing.defaultLocale

    const response = NextResponse.json({ language })
    response.cookies.set({
        name: COOKIE_NAME,
        value: language,
        path: "/",
        maxAge: COOKIE_MAX_AGE_SECONDS,
        sameSite: "lax",
    })
    return response
}
