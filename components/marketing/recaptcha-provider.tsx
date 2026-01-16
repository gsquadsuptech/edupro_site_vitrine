"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { loadRecaptchaScript } from "@/lib/recaptcha"

interface RecaptchaContextType {
  isLoaded: boolean
  executeRecaptcha: (action: string) => Promise<string>
}

const RecaptchaContext = createContext<RecaptchaContextType | undefined>(undefined)

export function useRecaptcha() {
  const context = useContext(RecaptchaContext)
  if (!context) {
    throw new Error("useRecaptcha must be used within RecaptchaProvider")
  }
  return context
}

interface RecaptchaProviderProps {
  children: ReactNode
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadScript = async () => {
      try {
        await loadRecaptchaScript()
        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to load reCAPTCHA:", error)
      }
    }

    loadScript()
  }, [])

  const executeRecaptcha = async (action: string): Promise<string> => {
    if (!isLoaded) {
      throw new Error("reCAPTCHA is not loaded yet")
    }

    const { executeRecaptcha: execute } = await import("@/lib/recaptcha")
    return execute(action)
  }

  return (
    <RecaptchaContext.Provider value={{ isLoaded, executeRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  )
}

