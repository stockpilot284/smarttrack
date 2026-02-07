import { Button } from '@/components/ui/button'
import OrDivider from '../OrDivider'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Provider } from '@supabase/supabase-js'
import { authActions } from '@/stores/auth.store'
import { Link } from '@tanstack/react-router'

const logInFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(64, { message: 'Password must be at most 64 characters.' }),
})

type LogInFormValues = z.infer<typeof logInFormSchema>

export default function SignInForm() {
  return (
    <section
      className="flex-1 md:flex justify-center items-center py-8 lg:py-0"
      id="log-in-form"
    >
      <div className="w-full md:w-100 flex flex-col items-center  px-6 ">
        {/* Logo  */}
        <Link className="flex items-center gap-1.5 lg:w-full" to="/">
          <img src={'/assets/logo.svg'} alt="SmartTrack Logo" />
          <p className="text-sm font-bold text-foreground">SmartTrack</p>
        </Link>

        {/* Title & Login CTA */}
        <div className="pt-10 pb-2.5 flex flex-col gap-1.5 items-center lg:items-start lg:w-full">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back </h1>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Dont't have an account?{' '}
              <Link to="/auth/sign-up" className="text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Continue With Google */}
        <div className="py-2.5 w-full">
          <Button
            variant={'outline'}
            leftIcon={<img src="/assets/google-icon.svg" alt="Google Icon" />}
            className="text-primary w-full border-primary hover:bg-primary/5 hover:text-primary"
          >
            Continue with Google
          </Button>
        </div>

        {/* Or Divider */}
        <OrDivider />

        {/* Form Fields */}
        <FormContent />

        {/* Terms and Privacy */}
        <div className="pt-4 text-center lg:text-left">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link to="/" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

function FormContent() {
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<LogInFormValues>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  async function onSubmit(data: LogInFormValues) {}

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full py-3 flex flex-col gap-4"
      >
        {/** Email Field */}
        <FormField
          control={form.control as any}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel mandatory={true}>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@example.com"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Password Field */}
        <FormField
          control={form.control as any}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel mandatory={true}>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Submit Button */}
        <Button
          type="submit"
          className="w-full "
          disabled={!form.formState.isValid || loading}
          loading={loading}
        >
          Log In
        </Button>
      </form>
    </Form>
  )
}
