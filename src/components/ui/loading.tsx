import * as React from "react"

import { cn } from "@/lib/utils"

import { Spinner } from "./spinner"

type LoadingProps = React.ComponentProps<"div"> & {
  label?: string
  spinnerClassName?: string
}

function Loading({
  className,
  label = "",
  spinnerClassName,
  ...props
}: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)} {...props}>
      <Spinner className={cn("size-6", spinnerClassName)} />
      <div className="text-sm font-medium">{label}</div>
    </div>
  )
}

export { Loading }
