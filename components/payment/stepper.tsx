'use client';

import { CheckIcon } from 'lucide-react';

interface Step {
    id: number;
    label: string;
    skipped?: boolean;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
    // Filtrer les étapes non sautées pour l'affichage
    const visibleSteps = steps.filter(step => !step.skipped);

    return (
        <div className="w-full">
            <ol className="flex items-center w-full">
                {visibleSteps.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    const isLast = index === visibleSteps.length - 1;

                    return (
                        <li key={step.id} className={`flex items-center ${isLast ? 'w-auto' : 'w-full'}`}>
                            <div
                                className={`
                  flex items-center justify-center w-8 h-8 rounded-full 
                  ${isActive ? 'bg-primary text-white' : ''} 
                  ${isCompleted ? 'bg-green-500 text-white' : ''} 
                  ${(!isActive && !isCompleted) ? 'bg-gray-200 text-gray-700' : ''}
                  transition-colors duration-300
                `}
                                aria-label={`Étape ${step.id}: ${step.label}`}
                                tabIndex={0}
                            >
                                {isCompleted ? (
                                    <CheckIcon className="w-5 h-5" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>

                            <span
                                className={`
                  ml-2 text-sm font-medium 
                  ${isActive ? 'text-primary' : ''} 
                  ${isCompleted ? 'text-green-500' : ''} 
                  ${(!isActive && !isCompleted) ? 'text-gray-500' : ''}
                `}
                            >
                                {step.label}
                            </span>

                            {!isLast && (
                                <div className="flex-1 mx-4">
                                    <div
                                        className={`
                      h-1 w-full rounded-full
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                                    ></div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};
