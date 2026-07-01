import type { CheckoutStep } from '../types'

const steps: { key: CheckoutStep; label: string; num: number }[] = [
  { key: 'cart', label: 'Cart', num: 1 },
  { key: 'checkout', label: 'Checkout', num: 2 },
  { key: 'payment', label: 'Payment', num: 3 },
  { key: 'confirmation', label: 'Confirmation', num: 4 },
]

interface StepperProps {
  current: CheckoutStep
}

export default function Stepper({ current }: StepperProps) {
  const currentIdx = steps.findIndex((s) => s.key === current)

  return (
    <div className="flex items-center justify-between px-2">
      {steps.map((step, idx) => {
        const isActive = idx === currentIdx
        const isCompleted = idx < currentIdx

        return (
          <div key={step.key} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {idx > 0 && (
                <div
                  className={`h-0.5 flex-1 ${isCompleted || isActive ? 'bg-brand' : 'bg-gray-200'}`}
                />
              )}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive
                    ? 'bg-brand text-white'
                    : isCompleted
                      ? 'bg-brand text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? '✓' : step.num}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${isCompleted ? 'bg-brand' : 'bg-gray-200'}`}
                />
              )}
            </div>
            <span
              className={`mt-1 text-[10px] font-medium ${
                isActive ? 'text-brand' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
