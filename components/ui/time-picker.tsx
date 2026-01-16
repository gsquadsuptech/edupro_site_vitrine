"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function TimePicker({ value, onChange, className, disabled }: TimePickerProps) {
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  
  // Extraire les heures et minutes du format HH:MM ou HH:MM:SS
  const getHoursAndMinutes = (timeString: string): { hours: string, minutes: string } => {
    if (!timeString) return { hours: "00", minutes: "00" };
    
    // Pour les formats HH:MM:SS ou HH:MM
    const timeParts = timeString.split(":");
    if (timeParts.length >= 2) {
      return { 
        hours: timeParts[0].padStart(2, "0"), 
        minutes: timeParts[1].padStart(2, "0") 
      };
    }
    
    // Tenter d'extraire des chiffres
    const timeMatch = timeString.match(/(\d{1,2})[^0-9]*(\d{1,2})/);
    if (timeMatch) {
      return { 
        hours: timeMatch[1].padStart(2, "0"), 
        minutes: timeMatch[2].padStart(2, "0") 
      };
    }
    
    return { hours: "00", minutes: "00" };
  };
  
  const { hours, minutes } = getHoursAndMinutes(value);
  
  // État local pour les heures et minutes avec des valeurs par défaut
  const [localHours, setLocalHours] = React.useState(hours || "00");
  const [localMinutes, setLocalMinutes] = React.useState(minutes || "00");
  
  // Mettre à jour l'état local quand la valeur change depuis l'extérieur
  React.useEffect(() => {
    const { hours: newHours, minutes: newMinutes } = getHoursAndMinutes(value);
    setLocalHours(newHours);
    setLocalMinutes(newMinutes);
  }, [value]);
  
  // Envoyer la mise à jour au parent
  const emitChange = (hours: string, minutes: string) => {
    // Formater avec padding zéro pour l'envoi final
    const formattedHours = hours.padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");
    onChange(`${formattedHours}:${formattedMinutes}:00`);
  };
  
  // Gestionnaire pour le champ des heures
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Accepter uniquement les chiffres
    if (!/^\d*$/.test(input)) return;
    
    // Autoriser la saisie vide ou d'un ou deux chiffres
    if (input.length <= 2) {
      setLocalHours(input);
      
      // Si 2 chiffres ont été saisis et qu'ils sont valides, passer aux minutes
      if (input.length === 2) {
        const hoursNum = parseInt(input, 10);
        if (hoursNum >= 0 && hoursNum <= 23) {
          minuteRef.current?.focus();
          minuteRef.current?.select();
          emitChange(input, localMinutes);
        }
      }
    }
  };
  
  // Gestionnaire pour le champ des minutes
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Accepter uniquement les chiffres
    if (!/^\d*$/.test(input)) return;
    
    // Autoriser la saisie vide ou d'un ou deux chiffres
    if (input.length <= 2) {
      setLocalMinutes(input);
      
      // Si on a 2 chiffres valides, envoyer le changement complet
      if (input.length === 2) {
        const minutesNum = parseInt(input, 10);
        if (minutesNum >= 0 && minutesNum <= 59) {
          emitChange(localHours, input);
        }
      }
    }
  };
  
  // Gestionnaire pour le focus perdu (blur)
  const handleBlur = () => {
    // Valider et formater les valeurs
    const hoursNum = parseInt(localHours, 10);
    const minutesNum = parseInt(localMinutes, 10);
    
    // S'assurer que les valeurs sont dans les plages valides
    const validHours = !isNaN(hoursNum) && hoursNum >= 0 && hoursNum <= 23 
      ? localHours.padStart(2, "0") 
      : "00";
      
    const validMinutes = !isNaN(minutesNum) && minutesNum >= 0 && minutesNum <= 59 
      ? localMinutes.padStart(2, "0") 
      : "00";
    
    // Mettre à jour l'affichage
    setLocalHours(validHours);
    setLocalMinutes(validMinutes);
    
    // Envoyer la mise à jour finale
    emitChange(validHours, validMinutes);
  };
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="grid gap-1.5 flex-1">
        <Label htmlFor="time" className="sr-only">
          Time
        </Label>
        <div className={cn(
          "relative flex h-10 items-center border rounded-md focus-within:ring-1 focus-within:ring-ring",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <Clock className="absolute left-2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <div className="flex items-center w-full pl-8">
            <input
              ref={hourRef}
              className="w-10 text-center border-none focus:outline-none focus:ring-0 text-base"
              type="text"
              inputMode="numeric"
              placeholder="00"
              value={localHours}
              onChange={handleHoursChange}
              onBlur={handleBlur}
              maxLength={2}
              aria-label="Hours"
              disabled={disabled}
            />
            <span className="mx-1 text-muted-foreground">:</span>
            <input
              ref={minuteRef}
              className="w-10 text-center border-none focus:outline-none focus:ring-0 text-base"
              type="text"
              inputMode="numeric"
              placeholder="00"
              value={localMinutes}
              onChange={handleMinutesChange}
              onBlur={handleBlur}
              maxLength={2}
              aria-label="Minutes"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 