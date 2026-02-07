import { CheckCircle } from 'lucide-react'

export default function FinishAndGo() {
  return (
    <div className="text-lg font-medium flex flex-col gap-8 w-full">
      {/* Success Icon */}
      <div className="mb-6 flex items-center justify-center lg:block ">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-green-100 md:flex items-center justify-center hidden">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-4 text-center lg:text-left">
        <h2 className="text-2xl font-medium text-foreground">
          You're ready to go!
        </h2>
        <p className="text-sm text-muted-foreground md:mx-auto lg:mx-auto max-w-md font-normal">
          Your delivery management workspace has been successfully configured
          and is ready to use.
        </p>
      </div>
    </div>
  )
}
